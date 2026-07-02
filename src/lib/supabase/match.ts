import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { universities as catalogFallback } from "@/lib/data/universities";
import type { OnboardingData } from "@/lib/user-store";
import type { University } from "@/lib/types";

/**
 * Personalized Fit Score + Safety/Target/Reach classification, resolved
 * server-side against the signed-in user's own `onboarding_data`. Falls back
 * to a pure-TS scorer over the bundled catalog when Supabase is unconfigured
 * (same "always runnable in dev" contract as the rest of src/lib/supabase/*).
 */

export type MatchClassification = "safety" | "target" | "reach";

export interface UniversityMatch {
  universityId: string;
  matchScore: number; // 0-100
  classification: MatchClassification;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Trigram (3-gram) set similarity — a JS mirror of Postgres pg_trgm.similarity(). */
function trigrams(s: string): Set<string> {
  const padded = `  ${s}  `;
  const grams = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) grams.add(padded.slice(i, i + 3));
  return grams;
}

function trigramSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const setA = trigrams(a);
  const setB = trigrams(b);
  let intersection = 0;
  for (const g of setA) if (setB.has(g)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Pure scorer — mirrors the match_universities() SQL RPC formula 1:1
 * (supabase/migrations/0003_match_universities.sql). Missing profile/catalog
 * data maps to a neutral 60 sub-score rather than penalizing incompleteness.
 */
export function computeMatch(profile: OnboardingData | null | undefined, university: University): UniversityMatch {
  const reqGpa = university.requirements.gpa;
  const gpaFit =
    !profile?.gpa || !reqGpa
      ? 60
      : clamp(Math.round(50 + ((profile.gpa / (profile.gpaScale || 4)) * 4 - reqGpa) * 40), 0, 100);

  const reqIelts = university.requirements.ielts;
  const ieltsFit =
    !profile?.ielts || !reqIelts ? 60 : clamp(Math.round(50 + (profile.ielts - reqIelts) * 20), 0, 100);

  const major = profile?.intendedMajor?.trim().toLowerCase();
  const majorFit =
    !major || university.tags.length === 0
      ? 60
      : clamp(
          Math.round(university.tags.reduce((max, tag) => Math.max(max, trigramSimilarity(tag.toLowerCase(), major)), 0) * 140),
          0,
          100,
        );

  const rankFit = clamp(Math.round(100 - (university.rankWorld || 800) / 12), 30, 99);

  const matchScore = clamp(Math.round(0.35 * gpaFit + 0.25 * ieltsFit + 0.25 * majorFit + 0.15 * rankFit), 0, 100);

  const classification: MatchClassification =
    matchScore < 45
      ? "reach"
      : matchScore >= 70 && (!university.acceptanceRate || university.acceptanceRate >= 30)
        ? "safety"
        : "target";

  return { universityId: university.id, matchScore, classification };
}

/**
 * Resolves Smart Match results for the signed-in user.
 *
 * - Supabase configured: calls the match_universities() RPC via the server
 *   client (cookie-bound → auth.uid()-scoped). No client-supplied profile is
 *   ever sent to the RPC — `fallbackProfile` is ignored on this path.
 * - Supabase unconfigured: scores the bundled catalog locally using
 *   `fallbackProfile` (the caller's local/demo onboarding data — there is no
 *   server-side session to read from in this mode, same limitation every
 *   other Supabase-backed feature in this repo has offline).
 */
export async function getUniversityMatches(
  limit = 60,
  offset = 0,
  fallbackProfile?: OnboardingData | null,
): Promise<UniversityMatch[]> {
  if (!isSupabaseConfigured()) {
    const exclude = new Set(fallbackProfile?.excludeCountries ?? []);
    return catalogFallback
      .filter((u) => !exclude.has(u.country))
      .map((u) => computeMatch(fallbackProfile, u))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(offset, offset + limit);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase.rpc("match_universities", { p_limit: limit, p_offset: offset });
    if (error || !Array.isArray(data)) return [];

    return (data as Record<string, unknown>[]).map((r) => ({
      universityId: String(r.university_id),
      matchScore: Number(r.match_score),
      classification: (r.classification as MatchClassification) ?? "target",
    }));
  } catch {
    return [];
  }
}
