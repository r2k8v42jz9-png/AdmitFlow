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
    if (!isSupabaseConfigured()) {
      // Auth unavailable — resolve the session as "no user" so gates fall through
      // to /login instead of hanging on a loader.
      markRemoteResolved();
      return;
    }
    let active = true;
    let unsubscribe: (() => void) | undefined;

    // Safety net: never leave the app stuck on a loader. If session resolution
    // hangs (network, slow Supabase), resolve as "no user" after a timeout so
    // the gates fall through to /login instead of an infinite spinner.
    const safety = setTimeout(() => {
      if (active) markRemoteResolved();
    }, 8000);

    (async () => {
      try {
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

        if (user) {
          try {
            await hydrateLocalFromProfile();
          } catch {
            // Profile read failed — still resolve the session so the gate can
            // decide (it will route based on whatever loaded, or to /login).
            markRemoteResolved();
          }
        } else {
          markRemoteResolved();
        }

        const { data } = supabase.auth.onAuthStateChange(async (event) => {
          if (event === "SIGNED_OUT") {
            store.signOut();
          } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
            try {
              await hydrateLocalFromProfile();
            } catch {
              markRemoteResolved();
            }
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();
      } catch {
        // Any failure (dynamic import, getUser) must not wedge the gate.
        if (active) markRemoteResolved();
      }
    })();

    return () => {
      active = false;
      clearTimeout(safety);
      unsubscribe?.();
    };
  }, []);

  return null;
}
