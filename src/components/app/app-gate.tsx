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
 *   otherwise          → render the app (free, trial or premium)
 *
 * The app is NOT paywalled at the door — free users get the explorer, shortlist
 * and a limited mentor; Premium features are gated in-app via entitlements.
 *
 * When Supabase is configured, `proxy.ts` provides authoritative server-side
 * protection and `SessionSync` hydrates the store from the database; this gate
 * waits for that resolution before deciding, then mirrors the same rules.
 */
export function AppGate({ children }: { children: ReactNode }) {
  const { hydrated, remoteResolved, authenticated, onboarded } = useUser();
  const router = useRouter();

  // bfcache guard: Back after sign-out can restore this page from the browser's
  // back/forward cache with the old in-memory state (authenticated=true) and NO
  // server request — so proxy.ts never gets a chance to re-gate. Restoring from
  // bfcache (e.persisted) forces a real reload, which re-runs the proxy.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const configured = isSupabaseConfigured();
  const ready = hydrated && (remoteResolved || !configured);
  // Email verification is intentionally not required.
  const allowed = authenticated && onboarded;

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace("/login");
    } else if (!onboarded) {
      router.replace("/onboarding");
    } else {
      recordVisit();
      const s = getUserState();
      if (s.streak.lastVisit) {
        import("@/lib/supabase/data").then(({ saveStreak }) =>
          saveStreak(s.streak.count, s.streak.lastVisit as string),
        );
      }
    }
  }, [ready, authenticated, onboarded, router]);

  if (!ready || !allowed) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
