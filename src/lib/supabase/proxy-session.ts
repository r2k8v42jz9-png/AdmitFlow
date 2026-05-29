import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session on each request and returns the user plus the
 * bound server client (so the proxy can run DB-backed guard checks). Keeps auth
 * cookies fresh so server components and route handlers see a valid session.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() revalidates the token with Supabase (never trust getSession alone).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const emailVerified = Boolean(user?.email_confirmed_at ?? user?.confirmed_at);

  return { response, supabase, user, emailVerified };
}
