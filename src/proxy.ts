import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Authoritative, DB-backed route protection (Next.js 16 "proxy").
 *
 * Hard guard chain for the app — enforced server-side against real Supabase
 * auth + Postgres records, so it cannot be bypassed by client state:
 *
 *   not signed in                         → /login
 *   signed in, onboarding NOT complete     → /onboarding
 *   onboarded                              → allowed (free, trial or premium)
 *
 * The app is NOT paywalled at the door: free users get the explorer, shortlist
 * and a limited mentor. Premium features are gated in-app via entitlements; the
 * 7-day trial is derived from account age. Email verification not required.
 */

const APP_PREFIXES = ["/dashboard", "/mentor", "/universities", "/roadmap", "/profile", "/settings"];

function matches(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

function redirect(request: NextRequest, pathname: string, withNext = false) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (withNext) url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  // Without Supabase configured, auth is unavailable — block the app entirely.
  if (!isSupabaseConfigured()) {
    if (matches(request.nextUrl.pathname, [...APP_PREFIXES, "/onboarding"])) {
      return redirect(request, "/login");
    }
    return NextResponse.next();
  }

  const { updateSession } = await import("@/lib/supabase/proxy-session");
  const { response, supabase, user } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isApp = matches(path, APP_PREFIXES);
  const isOnboarding = path === "/onboarding" || path.startsWith("/onboarding/");

  if (!isApp && !isOnboarding) return response;

  // 1) Must be signed in.
  if (!user) return redirect(request, "/login", true);

  // /onboarding is allowed for any signed-in user.
  if (isOnboarding) return response;

  // 2) Onboarding must be complete. (No subscription gate — the app is free to
  //    enter; Premium features are gated in-app via entitlements.)
  const { data: onboarding } = await supabase
    .from("onboarding_data")
    .select("completed")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!onboarding?.completed) return redirect(request, "/onboarding");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
