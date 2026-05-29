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
  authenticated: boolean;
  name: string;
  email: string;
  onboarded: boolean;
  plan: Plan | null;
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

const STORAGE_KEY = "admitflow:user";

const SERVER_STATE: UserState = {
  hydrated: false,
  authenticated: false,
  name: "",
  email: "",
  onboarded: false,
  plan: null,
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

function persist() {
  if (typeof window === "undefined") return;
  try {
    const { hydrated: _hydrated, ...rest } = state;
    void _hydrated;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* storage unavailable — ignore */
  }
}

function ensureHydrated() {
  if (state.hydrated || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserState>;
      state = {
        ...SERVER_STATE,
        ...parsed,
        streak: { ...SERVER_STATE.streak, ...(parsed.streak ?? {}) },
        hydrated: true,
      };
    } else {
      state = { ...SERVER_STATE, hydrated: true };
    }
  } catch {
    state = { ...SERVER_STATE, hydrated: true };
  }
}

function setState(patch: Partial<UserState>) {
  state = { ...state, ...patch };
  persist();
  emit();
}

if (typeof window !== "undefined") {
  ensureHydrated();
  // Keep tabs in sync.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    state = { ...state, hydrated: false };
    ensureHydrated();
    emit();
  });
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

export function registerUser(name: string, email: string) {
  ensureHydrated();
  setState({
    authenticated: true,
    name: name.trim() || nameFromEmail(email),
    email: email.trim(),
    onboarded: false,
    plan: null,
    onboarding: null,
  });
}

export function loginUser(email: string, name?: string) {
  ensureHydrated();
  const sameUser = state.email === email.trim();
  setState({
    authenticated: true,
    email: email.trim(),
    name: (name?.trim() || (sameUser ? state.name : "") || nameFromEmail(email)),
    // Preserve onboarding & plan if we recognize this account.
    onboarded: sameUser ? state.onboarded : false,
    plan: sameUser ? state.plan : null,
    onboarding: sameUser ? state.onboarding : null,
  });
}

export function saveOnboarding(data: OnboardingData, name?: string) {
  ensureHydrated();
  setState({
    onboarded: true,
    onboarding: data,
    ...(name?.trim() ? { name: name.trim() } : {}),
  });
}

export function setPlan(plan: Plan) {
  ensureHydrated();
  setState({ plan });
}

/**
 * Populates the local UI cache from a remote (Supabase) profile after login.
 * Lets the existing components keep reading the synchronous store while the
 * real source of truth lives in the database.
 */
export function hydrateFromRemote(patch: Partial<Omit<UserState, "hydrated">>) {
  ensureHydrated();
  setState({ authenticated: true, ...patch });
}

export function signOut() {
  state = { ...SERVER_STATE, hydrated: true };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
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
