"use client";

import { useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type Plan = "free" | "starter" | "pro" | "premium";

export interface OnboardingData {
  degreeLevel: string;
  intendedMajor: string;
  gpa: number | null;
  gpaScale: number;
  ielts: number | null;
  sat: number | null;
  countries: string[];
  budget: number | null;
  strengths: string[];
  dreamUniversities: string[];
  targetIntake: string;
}

export interface StreakState {
  count: number;
  lastVisit: string | null;
}

export interface UserState {
  hydrated: boolean;
  /** True once the Supabase session has been resolved by SessionSync. */
  remoteResolved: boolean;
  authenticated: boolean;
  emailVerified: boolean;
  name: string;
  email: string;
  onboarded: boolean;
  plan: Plan | null;
  subscriptionActive: boolean;
  /** ISO timestamp the account was created — drives the 7-day Premium trial. */
  createdAt: string | null;
  onboarding: OnboardingData | null;
  streak: StreakState;
}

export interface DerivedProfile {
  firstName: string;
  admissionScore: number;
  profileCompletion: number;
  planLabel: string;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const SERVER_STATE: UserState = {
  hydrated: false,
  remoteResolved: false,
  authenticated: false,
  emailVerified: false,
  name: "",
  email: "",
  onboarded: false,
  plan: null,
  subscriptionActive: false,
  createdAt: null,
  onboarding: null,
  streak: { count: 0, lastVisit: null },
};

/* -------------------------------------------------------------------------- */
/*  Store internals                                                           */
/* -------------------------------------------------------------------------- */

let state: UserState = SERVER_STATE;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function ensureHydrated() {
  if (state.hydrated || typeof window === "undefined") return;
  // In-memory only. There is NO localStorage persistence: the source of truth is
  // Supabase. SessionSync hydrates this cache from the database and flips
  // remoteResolved once the session is known.
  state = { ...SERVER_STATE, hydrated: true, remoteResolved: false };
}

function setState(patch: Partial<UserState>) {
  state = { ...state, ...patch };
  emit();
}

if (typeof window !== "undefined") {
  ensureHydrated();
}

/* -------------------------------------------------------------------------- */
/*  React binding                                                             */
/* -------------------------------------------------------------------------- */

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureHydrated();
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

export function useUser(): UserState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getUserState(): UserState {
  ensureHydrated();
  return state;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return "there";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function planLabel(plan: Plan | null): string {
  switch (plan) {
    case "free":
      return "Explorer";
    case "starter":
      return "Starter";
    case "pro":
      return "Pro";
    case "premium":
      return "Premium Mentor";
    default:
      return "No plan";
  }
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                   */
/* -------------------------------------------------------------------------- */

export function saveOnboarding(data: OnboardingData, name?: string) {
  ensureHydrated();
  setState({
    onboarded: true,
    onboarding: data,
    ...(name?.trim() ? { name: name.trim() } : {}),
  });
}

/** Marks a plan selected + (mock) active in the UI cache; the DB write is the source of truth. */
export function setSubscription(plan: Plan, active: boolean) {
  ensureHydrated();
  setState({ plan, subscriptionActive: active });
}

/**
 * Populates the local UI cache from a remote (Supabase) profile after login.
 * Lets the existing components keep reading the synchronous store while the
 * real source of truth lives in the database.
 */
export function hydrateFromRemote(patch: Partial<Omit<UserState, "hydrated">>) {
  ensureHydrated();
  setState({ authenticated: true, ...patch, remoteResolved: true });
}

/** Marks the remote (Supabase) session as resolved — e.g. when no user is signed in. */
export function markRemoteResolved() {
  ensureHydrated();
  setState({ remoteResolved: true });
}

export function signOut() {
  state = { ...SERVER_STATE, hydrated: true, remoteResolved: true };
  emit();
}

/** Records a visit for the day-streak system. Increments only on consecutive days. */
export function recordVisit(now: Date = new Date()) {
  ensureHydrated();
  const today = toDateStr(now);
  if (state.streak.lastVisit === today) return;

  const yesterday = toDateStr(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const wasYesterday = state.streak.lastVisit === yesterday;
  const count = wasYesterday ? state.streak.count + 1 : 1;

  setState({ streak: { count, lastVisit: today } });
}

/* -------------------------------------------------------------------------- */
/*  Derivations                                                               */
/* -------------------------------------------------------------------------- */

export function deriveProfile(s: UserState): DerivedProfile {
  const o = s.onboarding;
  const firstName = (s.name || nameFromEmail(s.email) || "there").split(" ")[0];

  // Admission score = average of present normalized signals.
  const signals: number[] = [];
  if (o?.gpa != null && o.gpaScale) signals.push((o.gpa / o.gpaScale) * 100);
  if (o?.ielts != null) signals.push((o.ielts / 9) * 100);
  if (o?.sat != null) signals.push((o.sat / 1600) * 100);
  const admissionScore = signals.length
    ? Math.round(signals.reduce((a, b) => a + b, 0) / signals.length)
    : 0;

  // Profile completion = fraction of meaningful fields filled (out of 11).
  const checks = [
    !!o?.degreeLevel,
    !!o?.intendedMajor,
    o?.gpa != null,
    o?.ielts != null,
    o?.sat != null,
    (o?.countries?.length ?? 0) > 0,
    o?.budget != null,
    (o?.strengths?.length ?? 0) > 0,
    (o?.dreamUniversities?.length ?? 0) > 0,
    !!o?.targetIntake,
    !!s.plan,
  ];
  const filled = checks.filter(Boolean).length;
  const profileCompletion = Math.round((filled / checks.length) * 100);

  return {
    firstName,
    admissionScore,
    profileCompletion,
    planLabel: planLabel(s.plan),
  };
}

/**
 * Six profile-strength dimensions derived from the user's real onboarding data.
 * `axis` holds a stable i18n key; the chart component resolves the label.
 * Values are 0–100.
 */
export function deriveRadar(s: UserState): { axis: string; value: number }[] {
  const o = s.onboarding;
  const clampPct = (n: number) => Math.max(8, Math.min(100, Math.round(n)));

  const academics = o?.gpa != null && o.gpaScale ? (o.gpa / o.gpaScale) * 100 : 0;
  const tests =
    o?.ielts != null || o?.sat != null
      ? ((o?.ielts != null ? (o.ielts / 9) * 100 : 0) + (o?.sat != null ? (o.sat / 1600) * 100 : 0)) /
        ((o?.ielts != null ? 1 : 0) + (o?.sat != null ? 1 : 0))
      : 0;
  const extracurriculars = Math.min(100, (o?.strengths?.length ?? 0) * 28);
  const ambition = Math.min(100, (o?.dreamUniversities?.length ?? 0) * 30);
  const focus = o?.intendedMajor && o?.degreeLevel ? 80 : o?.intendedMajor || o?.degreeLevel ? 45 : 0;
  const readiness = o?.targetIntake && (o?.countries?.length ?? 0) > 0 ? 78 : o?.targetIntake ? 40 : 0;

  return [
    { axis: "radar.academics", value: clampPct(academics) },
    { axis: "radar.tests", value: clampPct(tests) },
    { axis: "radar.extracurriculars", value: clampPct(extracurriculars) },
    { axis: "radar.ambition", value: clampPct(ambition) },
    { axis: "radar.focus", value: clampPct(focus) },
    { axis: "radar.readiness", value: clampPct(readiness) },
  ];
}
