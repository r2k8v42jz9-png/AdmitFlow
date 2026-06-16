"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/user-store";

/**
 * Central monetization model for AdmitFlow.
 *
 *   free     — permanent. Explorer, search, shortlist, basic profile, limited
 *              chance assessment, limited AI Mentor.
 *   trial    — first 7 days of every new account → full Premium access. Derived
 *              from the account's createdAt, so it needs no extra DB column.
 *   premium  — active paid subscription → full access, no limits.
 *
 * `hasPremiumAccess` is the single flag features check (trial OR premium).
 */

export const TRIAL_DAYS = 7;
export const FREE_MENTOR_DAILY_LIMIT = 5;
export const FREE_CHANCE_LIMIT = 3; // chance assessments before the free wall

export type Tier = "free" | "trial" | "premium";

export interface Entitlements {
  tier: Tier;
  isPremium: boolean; // paid subscription
  isTrial: boolean;
  hasPremiumAccess: boolean; // trial OR premium → all premium features
  trialDaysLeft: number; // 0 when not on trial
  mentorDailyLimit: number; // Infinity with premium access
}

function daysSince(iso: string | null, now: number): number {
  if (!iso) return 0;
  return (now - new Date(iso).getTime()) / 86_400_000;
}

export function deriveEntitlements(
  opts: { subscriptionActive: boolean; createdAt: string | null },
  now: number = Date.now(),
): Entitlements {
  // Paid (or DB-trialing) subscription → full premium.
  if (opts.subscriptionActive) {
    return { tier: "premium", isPremium: true, isTrial: false, hasPremiumAccess: true, trialDaysLeft: 0, mentorDailyLimit: Infinity };
  }
  // First 7 days → automatic Premium trial.
  const age = daysSince(opts.createdAt, now);
  if (opts.createdAt && age < TRIAL_DAYS) {
    return {
      tier: "trial",
      isPremium: false,
      isTrial: true,
      hasPremiumAccess: true,
      trialDaysLeft: Math.max(1, Math.ceil(TRIAL_DAYS - age)),
      mentorDailyLimit: Infinity,
    };
  }
  // Permanent free.
  return { tier: "free", isPremium: false, isTrial: false, hasPremiumAccess: false, trialDaysLeft: 0, mentorDailyLimit: FREE_MENTOR_DAILY_LIMIT };
}

// Dev/QA only: force a tier via localStorage("admitflow:dev-tier") = free|trial|premium.
// Read once at module load (never during render); never active in production.
const DEV_TIER: string | null =
  process.env.NODE_ENV !== "production" && typeof window !== "undefined"
    ? window.localStorage.getItem("admitflow:dev-tier")
    : null;

export function useEntitlements(): Entitlements {
  const { subscriptionActive, createdAt } = useUser();
  // Capture "now" once per mount so the render stays pure (no Date.now() in render).
  const [now] = useState(() => Date.now());
  if (DEV_TIER === "free") return deriveEntitlements({ subscriptionActive: false, createdAt: new Date(now - 30 * 86_400_000).toISOString() }, now);
  if (DEV_TIER === "trial") return deriveEntitlements({ subscriptionActive: false, createdAt: new Date(now).toISOString() }, now);
  if (DEV_TIER === "premium") return deriveEntitlements({ subscriptionActive: true, createdAt }, now);
  return deriveEntitlements({ subscriptionActive, createdAt }, now);
}

/* -------------------------------------------------------------------------- */
/*  AI Mentor usage — free tier: a few messages per day (resets daily).       */
/*  Client-side counter (localStorage) for the UX; premium = unlimited.       */
/* -------------------------------------------------------------------------- */

const USAGE_KEY = "admitflow:mentor-usage";
const today = () => new Date().toISOString().slice(0, 10);

interface Usage {
  date: string;
  count: number;
}

function readUsage(): Usage {
  if (typeof window === "undefined") return { date: today(), count: 0 };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const u = JSON.parse(raw) as Usage;
      if (u && u.date === today()) return { date: u.date, count: u.count || 0 };
    }
  } catch {
    /* ignore */
  }
  return { date: today(), count: 0 };
}

export interface MentorUsage {
  count: number;
  limit: number;
  unlimited: boolean;
  remaining: number;
  canSend: boolean;
  record: () => void;
}

export function useMentorUsage(): MentorUsage {
  const ent = useEntitlements();
  const [count, setCount] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(readUsage().count);
  }, []);

  const limit = ent.mentorDailyLimit;
  const unlimited = !Number.isFinite(limit);
  const remaining = unlimited ? Infinity : Math.max(0, limit - count);
  const canSend = unlimited || remaining > 0;

  const record = () => {
    if (unlimited) return;
    const next: Usage = { date: today(), count: readUsage().count + 1 };
    try {
      localStorage.setItem(USAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setCount(next.count);
  };

  return { count, limit, unlimited, remaining, canSend, record };
}
