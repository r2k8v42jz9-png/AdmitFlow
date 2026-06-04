import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Auth callback for BOTH email links and OAuth.
 *
 *  - Email links (password recovery, signup confirm, magic link, email change)
 *    arrive with `?token_hash=...&type=...` and are verified with `verifyOtp`.
 *    This is the robust path: unlike the PKCE `?code=` flow, it needs NO
 *    `code_verifier` cookie, so it works even when the link is opened in a
 *    different browser/in-app webview or after an email scanner touched it.
 *
 *  - OAuth (Google) arrives with `?code=` and is completed with
 *    `exchangeCodeForSession` (PKCE — the verifier cookie is present because the
 *    flow started in the same browser moments earlier).
 *
 * In both cases the session cookies must be written onto the SAME redirect
 * response we return, or the browser lands on `next` with no session and the
 * proxy bounces it back to /login.
 *
 * On failure we log the real reason (visible in Vercel function logs) and pass
 * a short `reason` on the redirect so the failure is diagnosable without log
 * access.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/onboarding";

  const fail = (reason: string) => {
    console.error(`[auth/callback] ${reason} (type=${type ?? "-"}, hasCode=${!!code}, hasTokenHash=${!!tokenHash})`);
    return NextResponse.redirect(`${origin}/login?error=auth_callback&reason=${encodeURIComponent(reason)}`);
  };

  if (!isSupabaseConfigured()) return fail("supabase_not_configured");
  if (!code && !tokenHash) return fail("missing_code_or_token");

  // The response we will return — Supabase writes auth cookies onto it.
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.headers
          .get("cookie")
          ?.split(";")
          .map((c) => {
            const idx = c.indexOf("=");
            return { name: c.slice(0, idx).trim(), value: c.slice(idx + 1).trim() };
          })
          .filter((c) => c.name) ?? [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Email-link flow (recovery etc.) — no code_verifier needed.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail(`verifyOtp_failed: ${error.message}`);
    return response;
  }

  // OAuth / PKCE code flow.
  const { error } = await supabase.auth.exchangeCodeForSession(code!);
  if (error) return fail(`exchange_failed: ${error.message}`);

  return response;
}
