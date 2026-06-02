"use client";

import { useMemo } from "react";
import { useSyncExternalStore } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getSavedUniversities,
  saveUniversity,
  unsaveUniversity,
  setUniversityCategory,
  type UniCategory,
} from "@/lib/supabase/universities";

export type { UniCategory };

/* -------------------------------------------------------------------------- */
/*  Saved-universities store                                                   */
/*                                                                            */
/*  Single, reactive source of truth for the user's saved / target schools.   */
/*  Backed by the `user_universities` table when Supabase is configured, with  */
/*  a localStorage mirror so it works offline AND before the V4 migration is   */
/*  applied (the catalog/table can be absent — reads/writes degrade silently). */
/*  Every consumer (explorer, roadmap, dashboard) subscribes here, so adding   */
/*  or removing a university updates them all in the same tick.                */
/* -------------------------------------------------------------------------- */

export interface SavedEntry {
  id: string;
  category: UniCategory;
}

const LS_KEY = "admitflow:saved-universities"; // richer {id,category}[] store
const LEGACY_KEY = "admitflow:bookmarks"; // old string[] bookmarks (migrated)

interface SavedState {
  hydrated: boolean;
  entries: SavedEntry[];
}

const SERVER_STATE: SavedState = { hydrated: false, entries: [] };

let state: SavedState = SERVER_STATE;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(patch: Partial<SavedState>) {
  state = { ...state, ...patch };
  emit();
}

/* ----------------------------- localStorage ------------------------------- */

function normalizeCategory(c: unknown): UniCategory {
  return c === "dream" || c === "safety" ? c : "target";
}

function readLocal(): SavedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((e): e is { id: unknown; category?: unknown } => !!e && typeof e === "object")
          .map((e) => ({ id: String((e as { id: unknown }).id), category: normalizeCategory((e as { category?: unknown }).category) }))
          .filter((e) => e.id);
      }
    }
    // Migrate legacy bookmarks (a plain string[] of ids) → default "target".
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const ids: unknown = JSON.parse(legacy);
      if (Array.isArray(ids)) {
        return ids.map((id) => ({ id: String(id), category: "target" as UniCategory })).filter((e) => e.id);
      }
    }
  } catch {
    /* corrupt storage → treat as empty */
  }
  return [];
}

function writeLocal(entries: SavedEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
    // Keep the legacy key mirrored (ids only) for any older code path.
    localStorage.setItem(LEGACY_KEY, JSON.stringify(entries.map((e) => e.id)));
  } catch {
    /* quota / unavailable → ignore */
  }
}

/* ------------------------------- hydration -------------------------------- */

let hydrating = false;

/**
 * Loads saved universities into the store. Reads localStorage first (instant,
 * works offline / pre-migration), then — when Supabase is configured and a user
 * is signed in — reconciles with `user_universities` (the server is the source
 * of truth when it has rows). Safe to call repeatedly; a no-op while in flight.
 */
export async function hydrateSavedUniversities(): Promise<void> {
  const local = readLocal();
  if (!state.hydrated) setState({ entries: local, hydrated: true });

  if (!isSupabaseConfigured() || hydrating) return;
  hydrating = true;
  try {
    // Returns [] for: no signed-in user, no saved rows, OR a missing table
    // (the data layer swallows the error) — so this never throws on pre-migration.
    const remote = await getSavedUniversities();
    if (remote.length > 0) {
      const entries = remote.map((r) => ({ id: r.university_id, category: normalizeCategory(r.category) }));
      setState({ entries, hydrated: true });
      writeLocal(entries);
    } else if (local.length > 0) {
      // Remote empty but we have local picks (saved before sign-in, or table not
      // yet migrated): best-effort push them up so they persist server-side once
      // the table exists. Each call is independently guarded.
      for (const e of local) {
        try {
          await saveUniversity(e.id, e.category);
        } catch {
          /* table missing / network → keep local copy */
        }
      }
      setState({ entries: local, hydrated: true });
    } else {
      setState({ hydrated: true });
    }
  } catch {
    // Any failure → keep whatever is in localStorage. No migration required.
    setState({ entries: local, hydrated: true });
  } finally {
    hydrating = false;
  }
}

/** Clears the store + local mirror (call on sign-out). */
export function resetSavedUniversities() {
  state = { hydrated: true, entries: [] };
  writeLocal([]);
  emit();
}

/* ------------------------------- mutations -------------------------------- */

export function saveSavedUniversity(id: string, category: UniCategory = "target") {
  const existing = state.entries.find((e) => e.id === id);
  if (existing) {
    if (existing.category === category) return;
    const entries = state.entries.map((e) => (e.id === id ? { ...e, category } : e));
    setState({ entries });
    writeLocal(entries);
  } else {
    const entries = [...state.entries, { id, category }];
    setState({ entries });
    writeLocal(entries);
  }
  if (isSupabaseConfigured()) saveUniversity(id, category).catch(() => {});
}

export function removeSavedUniversity(id: string) {
  if (!state.entries.some((e) => e.id === id)) return;
  const entries = state.entries.filter((e) => e.id !== id);
  setState({ entries });
  writeLocal(entries);
  if (isSupabaseConfigured()) unsaveUniversity(id).catch(() => {});
}

export function toggleSavedUniversity(id: string) {
  if (state.entries.some((e) => e.id === id)) removeSavedUniversity(id);
  else saveSavedUniversity(id);
}

export function setSavedCategory(id: string, category: UniCategory) {
  saveSavedUniversity(id, category);
  if (isSupabaseConfigured()) setUniversityCategory(id, category).catch(() => {});
}

/* ----------------------------- React binding ------------------------------ */

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

export interface UseSavedUniversities {
  entries: SavedEntry[];
  ids: string[];
  count: number;
  hydrated: boolean;
  isSaved: (id: string) => boolean;
  categoryOf: (id: string) => UniCategory | null;
  toggle: (id: string) => void;
  save: (id: string, category?: UniCategory) => void;
  remove: (id: string) => void;
  setCategory: (id: string, category: UniCategory) => void;
}

export function useSavedUniversities(): UseSavedUniversities {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // `s.entries` is reference-stable between mutations, so these stay stable too.
  const ids = useMemo(() => s.entries.map((e) => e.id), [s.entries]);
  return {
    entries: s.entries,
    ids,
    count: s.entries.length,
    hydrated: s.hydrated,
    isSaved: (id) => s.entries.some((e) => e.id === id),
    categoryOf: (id) => s.entries.find((e) => e.id === id)?.category ?? null,
    toggle: toggleSavedUniversity,
    save: saveSavedUniversity,
    remove: removeSavedUniversity,
    setCategory: setSavedCategory,
  };
}
