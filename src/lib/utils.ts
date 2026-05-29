import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatDate(input: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-US", opts ?? { month: "short", day: "numeric", year: "numeric" }).format(date);
}

/** Days from "today" (frozen 2026-05-29 for deterministic mock data) to target date. */
export function daysUntil(target: string | Date, from: Date = new Date("2026-05-29T00:00:00")) {
  const t = typeof target === "string" ? new Date(target) : target;
  const ms = t.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function relativeDeadline(target: string) {
  const d = daysUntil(target);
  if (d < 0) return { label: "Closed", tone: "muted" as const };
  if (d === 0) return { label: "Due today", tone: "danger" as const };
  if (d <= 7) return { label: `${d}d left`, tone: "danger" as const };
  if (d <= 30) return { label: `${d}d left`, tone: "warning" as const };
  return { label: `${d}d left`, tone: "ok" as const };
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

/** Deterministic pseudo-random in [0,1) from a seed — keeps SSR/CSR identical. */
export function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
