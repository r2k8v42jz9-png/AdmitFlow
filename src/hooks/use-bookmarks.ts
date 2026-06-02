"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "admitflow:bookmarks";

export function useBookmarks() {
  // Start EMPTY — new users have no saved universities until they save one.
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      // Sync persisted bookmarks from localStorage on mount (client-only hydration).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setIds(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
    },
    [ids, persist],
  );

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isSaved, hydrated, count: ids.length };
}
