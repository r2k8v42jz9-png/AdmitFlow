"use client";

import { createClient } from "@/lib/supabase/client";
import { loadUserState } from "@/lib/supabase/data";
import { hydrateFromRemote, signOut as signOutLocal } from "@/lib/user-store";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

const callbackUrl = (next: string) =>
  typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` : next;

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface EnabledProviders {
  google: boolean;
}

/**
 * Reads which social providers are enabled in the Supabase project (public,
 * unauthenticated settings endpoint). Lets the UI show a clear message instead
 * of a broken OAuth redirect. (Apple is intentionally not offered — Google +
 * email only for the demo.)
 */
export async function fetchEnabledProviders(): Promise<EnabledProviders> {
  if (!isSupabaseConfigured()) return { google: false };
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    if (!res.ok) return { google: false };
    const data = await res.json();
    const ext = (data?.external ?? {}) as Record<string, boolean>;
    return { google: Boolean(ext.google) };
  } catch {
    return { google: false };
  }
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

/**
 * Google OAuth — redirects to Google, returns via /auth/callback.
 * Lands on /dashboard so the proxy cascade routes to the correct step
 * (onboarding → pricing → dashboard) based on the user's real DB state.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl("/dashboard") },
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
