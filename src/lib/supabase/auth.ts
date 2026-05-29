"use client";

import { createClient } from "@/lib/supabase/client";
import { loadUserState } from "@/lib/supabase/data";
import { hydrateFromRemote, signOut as signOutLocal } from "@/lib/user-store";

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
  if (error) {
    // Unverified accounts can't sign in while "Confirm email" is on → send to verify page.
    if (error.code === "email_not_confirmed" || /not confirmed/i.test(error.message)) {
      return { ok: true, needsVerification: true };
    }
    return { ok: false, error: error.message };
  }

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
 * Reads the user's data from Supabase (profiles + onboarding_data +
 * subscriptions + streaks) and mirrors it into the local store so existing
 * components (dashboard, profile, roadmap, mentor) render immediately.
 * The per-user rows are auto-provisioned by the `handle_new_user` DB trigger.
 */
export async function hydrateLocalFromProfile(): Promise<void> {
  const state = await loadUserState();
  if (state) hydrateFromRemote(state);
}
