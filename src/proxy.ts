import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Authoritative, DB-backed route protection (Next.js 16 "proxy").
 *
 * Hard guard chain for the app — enforced server-side against real Supabase
 * auth + Postgres records, so it cannot be bypassed by client state:
 *
 *   not signed in                         → /login
 *   signed in, email NOT verified         → /verify-email
 *   verified, onboarding NOT complete      → /onboarding
 *   onboarded, subscription NOT active     → /pricing
 *   verified + onboarded + active sub      → allowed
 *
 * /onboarding itself requires a signed-in, verified user.
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
  const { response, supabase, user, emailVerified } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isApp = matches(path, APP_PREFIXES);
  const isOnboarding = path === "/onboarding" || path.startsWith("/onboarding/");

  if (!isApp && !isOnboarding) return response;

  // 1) Must be signed in.
  if (!user) return redirect(request, "/login", true);

  // 2) Must have a verified email.
  if (!emailVerified) return redirect(request, "/verify-email");

  // /onboarding is allowed for any verified user.
  if (isOnboarding) return response;

  // 3) Onboarding must be complete.
  const { data: onboarding } = await supabase
    .from("onboarding_data")
    .select("completed")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!onboarding?.completed) return redirect(request, "/onboarding");

  // 4) Subscription must be active.
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (subscription?.status !== "active") return redirect(request, "/pricing");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
