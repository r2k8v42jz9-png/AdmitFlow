"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { universities as catalogFallback, getUniversity } from "@/lib/data/universities";
import { rowToUniversity } from "@/lib/supabase/university-map";
import type { University } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Catalog search (Supabase RPC → falls back to the in-app catalog)          */
/* -------------------------------------------------------------------------- */

export interface UniversityFilters {
  q?: string;
  country?: string;
  field?: string;
  degree?: string;
  maxTuition?: number;
  maxQsRank?: number;
  needsScholarship?: boolean;
  limit?: number;
  offset?: number;
}

/** Columns + embedded relations to hydrate a full University (detail view). */
const FULL_SELECT = "*, university_programs(*), university_deadlines(*)";

/** Client-side equivalent of the search_universities RPC, for the fallback. */
function searchFallback(f: UniversityFilters): University[] {
  const q = f.q?.trim().toLowerCase();
  let list = catalogFallback.filter((u) => {
    if (q && !(`${u.name} ${u.shortName} ${u.country} ${u.city} ${u.tags.join(" ")}`.toLowerCase().includes(q)))
      return false;
    if (f.country && u.country !== f.country) return false;
    if (f.field && !u.tags.includes(f.field)) return false;
    if (f.degree && !u.programs.some((p) => p.degree === f.degree)) return false;
    if (f.maxTuition != null && u.tuitionPerYear > f.maxTuition) return false;
    if (f.maxQsRank != null && u.rankWorld > f.maxQsRank) return false;
    if (f.needsScholarship && u.scholarships.length === 0) return false;
    return true;
  });
  list = list.sort((a, b) => a.rankWorld - b.rankWorld);
  const offset = f.offset ?? 0;
  return list.slice(offset, offset + (f.limit ?? 24));
}

/**
 * Searches the catalog via the Supabase `search_universities` RPC (server-side
 * filters, ranking and pagination). Falls back to the bundled in-app catalog
 * ONLY when Supabase is unconfigured or the RPC errors — an empty result set
 * (e.g. the last page of pagination, or filters matching nothing) is returned
 * as-is so infinite scroll terminates correctly instead of re-showing locals.
 */
export async function searchUniversities(f: UniversityFilters = {}): Promise<University[]> {
  if (!isSupabaseConfigured()) return searchFallback(f);
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("search_universities", {
      q: f.q ?? null,
      p_country: f.country ?? null,
      p_field: f.field ?? null,
      p_degree: f.degree ?? null,
      max_tuition: f.maxTuition ?? null,
      max_qs_rank: f.maxQsRank ?? null,
      needs_scholarship: f.needsScholarship ?? false,
      p_limit: f.limit ?? 24,
      p_offset: f.offset ?? 0,
    });
    // RPC missing / errored → fall back to the bundled catalog. Empty array is a
    // valid result (end of pagination), so do NOT fall back on length === 0.
    if (error || !Array.isArray(data)) return searchFallback(f);
    return (data as Record<string, unknown>[]).map(rowToUniversity);
  } catch {
    return searchFallback(f);
  }
}

/* -------------------------------------------------------------------------- */
/*  Single university (detail) + filter facets                                */
/* -------------------------------------------------------------------------- */

/**
 * Loads one university with its programs + deadlines from Supabase. Falls back
 * to the bundled catalog if Supabase is unconfigured, the row is missing, or
 * the query errors.
 */
export async function getUniversityById(id: string): Promise<University | null> {
  if (!isSupabaseConfigured()) return getUniversity(id) ?? null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("universities")
      .select(FULL_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return getUniversity(id) ?? null;
    return rowToUniversity(data as Record<string, unknown>);
  } catch {
    return getUniversity(id) ?? null;
  }
}

/**
 * Batch-loads universities by id (one query), preserving the input order.
 * Falls back to the bundled catalog per-id on any failure.
 */
export async function getUniversitiesByIds(ids: string[]): Promise<University[]> {
  if (ids.length === 0) return [];
  const local = () => ids.map((id) => getUniversity(id)).filter((u): u is University => !!u);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("universities").select(FULL_SELECT).in("id", ids);
    if (error || !Array.isArray(data)) return local();
    const byId = new Map(
      (data as Record<string, unknown>[]).map((r) => {
        const u = rowToUniversity(r);
        return [u.id, u] as const;
      }),
    );
    return ids.map((id) => byId.get(id)).filter((u): u is University => !!u);
  } catch {
    return local();
  }
}

export interface UniversityFacets {
  countries: string[];
  fields: string[];
}

/**
 * Distinct countries + fields for the explorer's filter controls, derived from
 * the live catalog. Falls back to the bundled catalog's facets on any failure.
 * (At very large scale, replace the column scan with a dedicated facets RPC.)
 */
export async function getUniversityFacets(): Promise<UniversityFacets> {
  const fallback: UniversityFacets = {
    countries: [...new Set(catalogFallback.map((u) => u.country))].sort(),
    fields: [...new Set(catalogFallback.flatMap((u) => u.tags))].sort(),
  };
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("universities").select("country, fields");
    if (error || !Array.isArray(data) || data.length === 0) return fallback;
    const countries = new Set<string>();
    const fields = new Set<string>();
    for (const row of data as { country: string | null; fields: string[] | null }[]) {
      if (row.country) countries.add(row.country);
      for (const f of row.fields ?? []) if (f) fields.add(f);
    }
    return {
      countries: [...countries].sort(),
      fields: [...fields].sort(),
    };
  } catch {
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/*  user_universities — saved lists / target builder                         */
/* -------------------------------------------------------------------------- */

export type UniCategory = "dream" | "target" | "safety";

export interface SavedUniversity {
  university_id: string;
  category: UniCategory;
  status: string;
  notes: string | null;
}

export async function getSavedUniversities(): Promise<SavedUniversity[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("user_universities")
    .select("university_id, category, status, notes")
    .eq("user_id", user.id);
  return (data as SavedUniversity[]) ?? [];
}

export async function saveUniversity(universityId: string, category: UniCategory = "target"): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("user_universities")
    .upsert({ user_id: user.id, university_id: universityId, category }, { onConflict: "user_id,university_id" });
}

export async function unsaveUniversity(universityId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_universities").delete().eq("user_id", user.id).eq("university_id", universityId);
}

export async function setUniversityCategory(universityId: string, category: UniCategory): Promise<void> {
  return saveUniversity(universityId, category);
}
