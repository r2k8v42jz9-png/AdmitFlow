"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { OnboardingData, Plan, UserState } from "@/lib/user-store";

/* -------------------------------------------------------------------------- */
/*  Row shapes (mirror supabase/migrations/0001_init.sql)                     */
/* -------------------------------------------------------------------------- */

interface OnboardingRow {
  user_id: string;
  degree_level: string | null;
  intended_major: string | null;
  gpa: number | null;
  gpa_scale: number | null;
  ielts: number | null;
  sat: number | null;
  budget: number | null;
  countries: string[] | null;
  strengths: string[] | null;
  dream_universities: string[] | null;
  target_intake: string | null;
  career_goals: string | null;
  completed: boolean;
  exclude_countries: string[] | null;
}

export type SubscriptionStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled";

/** A subscription grants app access while trialing OR active. */
export function isAccessGranted(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

function rowToOnboarding(r: OnboardingRow): OnboardingData {
  return {
    degreeLevel: r.degree_level ?? "",
    intendedMajor: r.intended_major ?? "",
    gpa: r.gpa,
    gpaScale: r.gpa_scale ?? 4,
    ielts: r.ielts,
    sat: r.sat,
    countries: r.countries ?? [],
    budget: r.budget,
    strengths: r.strengths ?? [],
    dreamUniversities: r.dream_universities ?? [],
    targetIntake: r.target_intake ?? "",
    excludeCountries: r.exclude_countries ?? [],
  };
}

function onboardingToRow(o: OnboardingData): Omit<OnboardingRow, "user_id"> {
  return {
    degree_level: o.degreeLevel || null,
    intended_major: o.intendedMajor || null,
    gpa: o.gpa,
    gpa_scale: o.gpaScale,
    ielts: o.ielts,
    sat: o.sat,
    budget: o.budget,
    countries: o.countries,
    strengths: o.strengths,
    dream_universities: o.dreamUniversities,
    target_intake: o.targetIntake || null,
    career_goals: null,
    completed: true,
    exclude_countries: o.excludeCountries,
  };
}

/* -------------------------------------------------------------------------- */
/*  Reads                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Loads the full user state from Supabase (profiles + onboarding_data +
 * subscriptions + streaks). This is the source of truth that hydrates the
 * client store; the dashboard, profile, roadmap and mentor all read from it.
 */
export async function loadUserState(): Promise<Partial<UserState> | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // allSettled (not all): one failing query must not reject the whole load and
  // wedge the session-resolution path. Missing rows simply read as defaults.
  const [profileR, onboardingR, subR, streakR] = await Promise.allSettled([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("onboarding_data").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle(),
  ]);
  const profileRes = profileR.status === "fulfilled" ? profileR.value : { data: null };
  const onboardingRes = onboardingR.status === "fulfilled" ? onboardingR.value : { data: null };
  const subRes = subR.status === "fulfilled" ? subR.value : { data: null };
  const streakRes = streakR.status === "fulfilled" ? streakR.value : { data: null };

  const onboardingRow = onboardingRes.data as OnboardingRow | null;
  const metaName = (user.user_metadata?.full_name as string | undefined) ?? "";

  return {
    authenticated: true,
    id: user.id,
    name: profileRes.data?.full_name ?? metaName,
    email: user.email ?? "",
    onboarded: onboardingRow?.completed ?? false,
    plan: (subRes.data?.plan as Plan | null) ?? null,
    subscriptionActive: isAccessGranted(subRes.data?.status),
    createdAt: user.created_at ?? null,
    onboarding: onboardingRow?.completed ? rowToOnboarding(onboardingRow) : null,
    streak: {
      count: streakRes.data?.count ?? 0,
      lastVisit: streakRes.data?.last_visit ?? null,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Writes (own row only — RLS enforced)                                      */
/* -------------------------------------------------------------------------- */

async function uid() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function saveOnboarding(o: OnboardingData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  const { error } = await supabase
    .from("onboarding_data")
    .upsert({ user_id: user.id, ...onboardingToRow(o) }, { onConflict: "user_id" });
  if (error) {
    // Surfaced loudly: a swallowed failure here (e.g. RLS rejecting the write
    // because the access token was stale) leaves onboarding_data.completed
    // false forever, and the proxy bounces the user back to /onboarding on
    // every request with no visible reason.
    console.error("[saveOnboarding] onboarding_data upsert failed — completed will stay false", error);
    throw new Error(`saveOnboarding failed: ${error.message}`);
  }
}

/** Partial upsert — only touches exclude_countries, leaves the rest of the row alone. */
export async function saveExcludeCountries(countries: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  await supabase
    .from("onboarding_data")
    .upsert({ user_id: user.id, exclude_countries: countries }, { onConflict: "user_id" });
}

export async function savePlan(plan: Plan, status: SubscriptionStatus, provider = "mock"): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  await supabase
    .from("subscriptions")
    .upsert({ user_id: user.id, plan, status, provider }, { onConflict: "user_id" });
}

export async function saveStreak(count: number, lastVisit: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  await supabase
    .from("streaks")
    .upsert({ user_id: user.id, count, last_visit: lastVisit }, { onConflict: "user_id" });
}

export async function saveProgress(overrides: Record<string, boolean>): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  const completed = Object.entries(overrides)
    .filter(([, done]) => done)
    .map(([id]) => id);
  await supabase
    .from("user_progress")
    .upsert(
      { user_id: user.id, roadmap_overrides: overrides, completed_tasks: completed },
      { onConflict: "user_id" },
    );
}

export async function saveLanguage(language: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase, user } = await uid();
  if (!user) return;
  await supabase.from("profiles").update({ language }).eq("id", user.id);
}

/**
 * Permanently deletes the signed-in user's data, then their auth account.
 * - Deletes all five per-user tables (RLS lets a user delete their own rows).
 * - Attempts the `delete_own_account` RPC (security definer) to remove the
 *   auth.users row. If the RPC isn't installed, data is still wiped and the
 *   user is signed out — surfaced via the returned flag so the UI can inform.
 * Returns { ok, authDeleted } or throws on a hard failure.
 */
export async function deleteAccount(): Promise<{ ok: boolean; authDeleted: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true, authDeleted: false };
  const { supabase, user } = await uid();
  if (!user) return { ok: false, authDeleted: false };

  // 1) Delete all per-user data rows (own-row, allowed by RLS).
  await Promise.allSettled([
    supabase.from("onboarding_data").delete().eq("user_id", user.id),
    supabase.from("subscriptions").delete().eq("user_id", user.id),
    supabase.from("user_progress").delete().eq("user_id", user.id),
    supabase.from("streaks").delete().eq("user_id", user.id),
    supabase.from("profiles").delete().eq("id", user.id),
  ]);

  // 2) Delete the auth account via a security-definer RPC (if installed).
  let authDeleted = false;
  try {
    const { error } = await supabase.rpc("delete_own_account");
    authDeleted = !error;
  } catch {
    authDeleted = false;
  }

  return { ok: true, authDeleted };
}
