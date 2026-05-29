"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser, getUserState, recordVisit } from "@/lib/user-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Guards the authenticated app shell. Enforces the product flow:
 *   not authenticated  → /login
 *   not onboarded      → /onboarding
 *   no plan            → /pricing
 *   otherwise          → render the app (and record a daily visit for streaks)
 *
 * When Supabase is configured, `proxy.ts` provides authoritative server-side
 * protection and `SessionSync` hydrates the store from the database; this gate
 * waits for that resolution before deciding, then mirrors the same rules.
 */
export function AppGate({ children }: { children: ReactNode }) {
  const { hydrated, remoteResolved, authenticated, onboarded, plan } = useUser();
  const router = useRouter();

  const configured = isSupabaseConfigured();
  const ready = hydrated && (remoteResolved || !configured);
  const allowed = authenticated && onboarded && !!plan;

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace("/login");
    } else if (!onboarded) {
      router.replace("/onboarding");
    } else if (!plan) {
      router.replace("/pricing");
    } else {
      recordVisit();
      if (configured) {
        const s = getUserState();
        if (s.streak.lastVisit) {
          import("@/lib/supabase/data").then(({ saveStreak }) =>
            saveStreak(s.streak.count, s.streak.lastVisit as string),
          );
        }
      }
    }
  }, [ready, authenticated, onboarded, plan, configured, router]);

  if (!ready || !allowed) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
