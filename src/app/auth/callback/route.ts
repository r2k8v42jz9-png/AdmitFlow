import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * OAuth + email-confirmation callback.
 * Supabase redirects here with a `code` after Google login or email verification.
 * We exchange it for a session (sets auth cookies) and continue the flow.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code && isSupabaseConfigured()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
