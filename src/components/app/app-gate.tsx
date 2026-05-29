"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser, getUserState, recordVisit } from "@/lib/user-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Guards the authenticated app shell. Enforces the product flow:
 *   not authenticated  → /login
 *   not onboarded      → /onboarding
 *   no plan / inactive → /pricing
 *   otherwise          → render the app (and record a daily visit for streaks)
 *
 * When Supabase is configured, server-side protection lives in `proxy.ts`; this
 * component additionally hydrates the local UI cache from the profile row on a
 * cold load so the dashboard renders without a round-trip to /login.
 */
export function AppGate({ children }: { children: ReactNode }) {
  const { hydrated, authenticated, onboarded, plan } = useUser();
  const router = useRouter();
  const [remoteChecked, setRemoteChecked] = useState(false);

  const allowed = authenticated && onboarded && !!plan;

  useEffect(() => {
    if (!hydrated) return;

    // Cold load with a valid Supabase session but empty local cache → hydrate.
    if (isSupabaseConfigured() && !authenticated && !remoteChecked) {
      (async () => {
        const { hydrateLocalFromProfile } = await import("@/lib/supabase/auth");
        await hydrateLocalFromProfile();
        setRemoteChecked(true);
      })();
      return;
    }

    if (!authenticated) {
      router.replace("/login");
    } else if (!onboarded) {
      router.replace("/onboarding");
    } else if (!plan) {
      router.replace("/pricing");
    } else {
      recordVisit();
      if (isSupabaseConfigured()) {
        const s = getUserState();
        if (s.streak.lastVisit) {
          import("@/lib/supabase/profiles").then(({ persistStreak }) =>
            persistStreak(s.streak.count, s.streak.lastVisit as string),
          );
        }
      }
    }
  }, [hydrated, authenticated, onboarded, plan, remoteChecked, router]);

  if (!hydrated || !allowed) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
