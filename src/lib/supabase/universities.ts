"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { universities as catalogFallback } from "@/lib/data/universities";
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

/** Maps a DB universities row to the app's `University` shape. */
function rowToUniversity(r: Record<string, unknown>): University {
  const reqs = (r.requirements ?? {}) as Record<string, number>;
  return {
    id: String(r.id),
    name: String(r.name),
    shortName: (r.short_name as string) ?? String(r.name),
    country: String(r.country),
    city: (r.city as string) ?? "",
    flag: "🏳️",
    logoColor: "#1d4ed8",
    rankWorld: (r.qs_rank as number) ?? 9999,
    rankNational: (r.national_rank as number) ?? 0,
    acceptanceRate: (r.acceptance_rate as number) ?? 0,
    tuitionPerYear: (r.tuition_min as number) ?? 0,
    currency: (r.currency as string) ?? "USD",
    livingCost: (r.living_cost as number) ?? 0,
    studentCount: (r.student_count as number) ?? 0,
    intlPercent: (r.intl_percent as number) ?? 0,
    fitScore: 0,
    admissionProbability: 0,
    tags: (r.fields as string[]) ?? [],
    requirements: {
      gpa: reqs.gpa ?? 0,
      ielts: reqs.ielts ?? 0,
      sat: reqs.sat,
      gre: reqs.gre,
      essays: reqs.essays ?? 0,
      recommendations: reqs.recommendations ?? 0,
    },
    deadlines: [],
    programs: [],
    scholarships: (r.scholarships as University["scholarships"]) ?? [],
    highlights: [],
    aiInsight: "",
    blurb: (r.description as string) ?? "",
    accent: "from-blue-500/25 to-indigo-500/10",
    website: (r.website as string) ?? undefined,
  };
}

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
 * Searches the catalog. Uses the Supabase `search_universities` RPC when the
 * catalog table is populated; otherwise falls back to the bundled in-app
 * catalog so the explorer works before the migration/import is run.
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
    // RPC missing / table empty → fall back to the bundled catalog.
    if (error || !Array.isArray(data) || data.length === 0) return searchFallback(f);
    return data.map(rowToUniversity);
  } catch {
    return searchFallback(f);
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
