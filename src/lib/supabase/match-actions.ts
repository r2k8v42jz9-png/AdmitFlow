"use server";

import { getUniversityMatches, type UniversityMatch } from "@/lib/supabase/match";
import type { OnboardingData } from "@/lib/user-store";

/**
 * Server Action boundary for match.ts — smart-match-view.tsx ("use client")
 * can't call getUniversityMatches directly since match.ts has no "use server"
 * directive of its own. `fallbackProfile` is only consulted on the
 * Supabase-unconfigured local/demo path (see match.ts); the live RPC always
 * derives the caller's profile itself from the authenticated session.
 */
export async function fetchUniversityMatches(
  limit?: number,
  offset?: number,
  fallbackProfile?: OnboardingData | null,
): Promise<UniversityMatch[]> {
  return getUniversityMatches(limit, offset, fallbackProfile);
}
