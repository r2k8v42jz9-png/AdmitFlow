import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * OAuth + email-confirmation callback.
 *
 * Supabase redirects here with a `?code=` after Google login (or email
 * confirmation). We exchange it for a session — and CRITICALLY, the session
 * cookies that `exchangeCodeForSession` writes must be attached to the SAME
 * redirect response we return, or the browser lands on the next page with no
 * session and the proxy bounces it straight back to /login (the OAuth loop).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback`);
  }

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
        // Attach every Set-Cookie to the redirect response itself.
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback`);
  }

  return response;
}
