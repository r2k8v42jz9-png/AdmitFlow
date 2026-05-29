"use client";

import { createClient } from "@/lib/supabase/client";
import { getProfile, saveProfile } from "@/lib/supabase/profiles";
import { hydrateFromRemote, signOut as signOutLocal, type Plan } from "@/lib/user-store";

const callbackUrl = (next: string) =>
  typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` : next;

export interface AuthResult {
  ok: boolean;
  needsVerification?: boolean;
  error?: string;
}

/** Email + password sign-up. Triggers a verification email; user must confirm before dashboard access. */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl("/onboarding"),
      data: { full_name: name },
    },
  });
  if (error) return { ok: false, error: error.message };
  // When email confirmation is enabled, there is no active session yet.
  const needsVerification = !data.session;
  return { ok: true, needsVerification };
}

/** Email + password sign-in. Hydrates the local UI cache from the profile row. */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  const verified = Boolean(data.user?.email_confirmed_at ?? data.user?.confirmed_at);
  if (!verified) return { ok: true, needsVerification: true };

  await hydrateLocalFromProfile();
  return { ok: true };
}

/** Google OAuth — redirects to Google, returns via /auth/callback. */
export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl("/onboarding") },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOutSupabase(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  signOutLocal();
}

/**
 * Reads the user's profile from Supabase and mirrors it into the local store
 * so existing components (dashboard, profile, roadmap) render immediately.
 * Creates an empty profile row on first login.
 */
export async function hydrateLocalFromProfile(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  let profile = await getProfile();
  if (!profile) {
    const fullName = (user.user_metadata?.full_name as string | undefined) ?? "";
    await saveProfile({ full_name: fullName });
    profile = await getProfile();
  }

  hydrateFromRemote({
    name: profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "",
    email: user.email ?? "",
    onboarded: profile?.onboarded ?? false,
    plan: (profile?.plan as Plan | null) ?? null,
    onboarding: profile?.onboarding ?? null,
    streak: {
      count: profile?.streak_count ?? 0,
      lastVisit: profile?.streak_last_visit ?? null,
    },
  });
}
