import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Server-side route protection (Next.js 16 "proxy", formerly middleware).
 *
 * When Supabase is configured it:
 *   1. Refreshes the auth session cookie on every request.
 *   2. Redirects unauthenticated users away from the app to /login.
 *   3. Redirects authenticated-but-unverified users to /verify-email
 *      (email verification is enforced — never skipped).
 *
 * When Supabase is NOT configured it passes through; the client-side AppGate
 * handles gating against the local fallback session.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/mentor", "/universities", "/roadmap", "/profile", "/settings"];

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const { updateSession } = await import("@/lib/supabase/proxy-session");
  const { response, user, emailVerified } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (!emailVerified) {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-email";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Run on everything except static assets and files with an extension.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
