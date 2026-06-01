"use client";

import { useSyncExternalStore } from "react";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

export type { Locale } from "@/lib/i18n/dictionaries";
export const LOCALES: Locale[] = ["ru", "en"];
export const DEFAULT_LOCALE: Locale = "ru";
const STORAGE_KEY = "admitflow:lang";

/* -------------------------------------------------------------------------- */
/*  External store (no provider needed; works anywhere, syncs across tabs)    */
/* -------------------------------------------------------------------------- */

let locale: Locale = DEFAULT_LOCALE;
let hydrated = false;
const listeners = new Set<() => void>();

function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "ru";
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) locale = stored;
  } catch {
    /* ignore */
  }
  hydrated = true;
  // Keep <html lang> in sync with the active locale (default or stored).
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}

export function setLocale(next: Locale) {
  ensureHydrated();
  if (next === locale) return;
  locale = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      /* ignore */
    }
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Locale {
  ensureHydrated();
  return locale;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

if (typeof window !== "undefined") {
  // Cross-tab sync.
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    if (isLocale(e.newValue)) {
      locale = e.newValue;
      for (const l of listeners) l();
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type TFunction = (key: string, vars?: Record<string, string | number>) => string;

/** Returns a translator bound to the current locale, with EN fallback. */
export function useT(): { t: TFunction; locale: Locale; setLocale: (l: Locale) => void } {
  const current = useLocale();
  const t: TFunction = (key, vars) => {
    const value = dictionaries[current][key] ?? dictionaries.en[key] ?? key;
    return interpolate(value, vars);
  };
  return { t, locale: current, setLocale };
}
