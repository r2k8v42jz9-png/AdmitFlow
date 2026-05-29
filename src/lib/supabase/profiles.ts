"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { OnboardingData, Plan } from "@/lib/user-store";

/** Shape of a row in the `profiles` table (see supabase/migrations/0001_profiles.sql). */
export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  language: string;
  plan: string | null;
  subscription_status: "inactive" | "active" | "past_due" | "canceled";
  onboarded: boolean;
  onboarding: OnboardingData | null;
  streak_count: number;
  streak_last_visit: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ProfilePatch = Partial<
  Pick<
    ProfileRow,
    "full_name" | "language" | "plan" | "subscription_status" | "onboarded" | "onboarding" | "streak_count" | "streak_last_visit"
  >
>;

/** Loads the signed-in user's profile row. Returns null if unconfigured or signed out. */
export async function getProfile(): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) return null;
  return data as ProfileRow;
}

/** Upserts fields onto the signed-in user's profile row. No-op when unconfigured. */
export async function saveProfile(patch: ProfilePatch): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email, ...patch }, { onConflict: "id" });
}

/** Convenience helpers used by onboarding / pricing flows. */
export async function persistOnboarding(onboarding: OnboardingData): Promise<void> {
  await saveProfile({ onboarded: true, onboarding });
}

export async function persistPlan(plan: Plan, subscriptionActive: boolean): Promise<void> {
  await saveProfile({ plan, subscription_status: subscriptionActive ? "active" : "inactive" });
}

export async function persistLanguage(language: string): Promise<void> {
  await saveProfile({ language });
}

export async function persistStreak(count: number, lastVisit: string): Promise<void> {
  await saveProfile({ streak_count: count, streak_last_visit: lastVisit });
}
