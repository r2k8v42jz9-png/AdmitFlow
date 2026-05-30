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

/**
 * Email + password sign-up. Email verification is disabled, so when the
 * Supabase project has "Confirm email" turned off this returns an active
 * session immediately and we hydrate the store and continue into onboarding.
 */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return { ok: false, error: error.message };
  if (data.session) await hydrateLocalFromProfile();
  return { ok: true };
}

/** Email + password sign-in. Hydrates the local UI cache from the profile row. */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
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
