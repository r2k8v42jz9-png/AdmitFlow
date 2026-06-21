"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/user-store";

/**
 * Central monetization model for AdmitFlow.
 *
 *   free  — permanent, no expiration. Explorer, search, shortlist, basic
 *           dashboard, basic chance assessment, limited AI Mentor (3 / day).
 *   pro   — $7.99/mo. Unlimited mentor & chance assessment, roadmap, deadlines,
 *           scholarship finder, application tracking.
 *   max   — $15/mo. Everything in Pro + priority AI, advanced analytics,
 *           premium admissions tools and future features.
 *
 * There is NO trial. Plan comes straight from the subscription record (or the
 * local store in the offline fallback); free is the default for everyone else.
 *
 * `hasPremiumAccess` is the single flag premium features check (pro OR max).
 */

export const FREE_MENTOR_DAILY_LIMIT = 3;
export const FREE_CHANCE_LIMIT = 3; // chance assessments before the free wall

export type Tier = "free" | "pro" | "max";

export interface Entitlements {
  tier: Tier;
  isFree: boolean;
  isPro: boolean;
  isMax: boolean;
  /** Any paid plan (pro or max) — used to hide upgrade prompts. */
  isPaid: boolean;
  /** Pro-or-better features (unlimited mentor, roadmap, deadlines, etc.). */
  hasPremiumAccess: boolean;
  /** Max-only features (priority AI, advanced analytics, premium tools). */
  hasMaxAccess: boolean;
  mentorDailyLimit: number; // Infinity for any paid plan
}

function normalizePlan(plan: string | null | undefined, active: boolean): Tier {
  if (!active) return "free";
  if (plan === "max") return "max";
  if (plan === "pro") return "pro";
  // Legacy paid plans (starter / premium / pro-mentor) map to Pro access.
  if (plan && plan !== "free") return "pro";
  return "free";
}

export function deriveEntitlements(opts: { plan: string | null; subscriptionActive: boolean }): Entitlements {
  const tier = normalizePlan(opts.plan, opts.subscriptionActive);
  const isPaid = tier !== "free";
  return {
    tier,
    isFree: tier === "free",
    isPro: tier === "pro",
    isMax: tier === "max",
    isPaid,
    hasPremiumAccess: isPaid,
    hasMaxAccess: tier === "max",
    mentorDailyLimit: isPaid ? Infinity : FREE_MENTOR_DAILY_LIMIT,
  };
}

// Dev/QA only: force a tier via localStorage("admitflow:dev-tier") = free|pro|max.
// Read once at module load (never during render); never active in production.
const DEV_TIER: string | null =
  process.env.NODE_ENV !== "production" && typeof window !== "undefined"
    ? window.localStorage.getItem("admitflow:dev-tier")
    : null;

export function useEntitlements(): Entitlements {
  const { plan, subscriptionActive } = useUser();
  if (DEV_TIER === "free") return deriveEntitlements({ plan: "free", subscriptionActive: false });
  if (DEV_TIER === "pro") return deriveEntitlements({ plan: "pro", subscriptionActive: true });
  if (DEV_TIER === "max") return deriveEntitlements({ plan: "max", subscriptionActive: true });
  return deriveEntitlements({ plan, subscriptionActive });
}

/* -------------------------------------------------------------------------- */
/*  AI Mentor usage — free tier: a few messages per day (resets daily).       */
/*  Client-side counter (localStorage) for the UX; paid = unlimited.          */
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
