import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUniversity } from "@/lib/data/universities";
import { rowToUniversity } from "@/lib/supabase/university-map";
import type { University } from "@/lib/types";

const FULL_SELECT = "*, university_programs(*), university_deadlines(*)";

/**
 * Server-side single-university fetch (for the detail page / metadata). Uses the
 * request-bound server client so it works in Server Components. Falls back to
 * the bundled catalog when Supabase is unconfigured, the row is missing, or the
 * query errors.
 */
export async function getUniversityByIdServer(id: string): Promise<University | null> {
  if (!isSupabaseConfigured()) return getUniversity(id) ?? null;
  try {
    const supabase = await createClient();
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
