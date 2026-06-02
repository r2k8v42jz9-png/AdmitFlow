"use client";

import { useSavedUniversities } from "@/lib/saved-universities";

/**
 * Backwards-compatible bookmarks hook. Now a thin wrapper over the shared,
 * reactive saved-universities store (backed by `user_universities` when
 * Supabase is configured, with a localStorage fallback). Keeping this surface
 * means the explorer and university detail keep working unchanged while gaining
 * cross-component reactivity and server-side persistence.
 */
export function useBookmarks() {
  const { ids, toggle, isSaved, hydrated, count } = useSavedUniversities();
  return { ids, toggle, isSaved, hydrated, count };
}
