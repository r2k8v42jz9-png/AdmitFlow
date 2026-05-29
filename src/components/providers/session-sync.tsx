"use client";

import { useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { markRemoteResolved } from "@/lib/user-store";

/**
 * Keeps the client store in sync with the Supabase session on every route.
 * Mounted once in the root layout so onboarding, pricing and the app shell all
 * see the authenticated session (Supabase is the source of truth; the store is
 * a revalidated cache). No-op when Supabase is not configured (local fallback).
 */
export function SessionSync() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const [{ createClient }, { hydrateLocalFromProfile }, store] = await Promise.all([
        import("@/lib/supabase/client"),
        import("@/lib/supabase/auth"),
        import("@/lib/user-store"),
      ]);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (user) await hydrateLocalFromProfile();
      else markRemoteResolved();

      const { data } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === "SIGNED_OUT") {
          store.signOut();
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          await hydrateLocalFromProfile();
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  return null;
}
