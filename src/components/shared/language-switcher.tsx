"use client";

import { Globe } from "lucide-react";
import { useT, LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABEL: Record<Locale, string> = { en: "EN", ru: "RU" };

/**
 * Compact EN/RU segmented switcher. Persists to localStorage and updates the
 * UI instantly (no reload). Visible in the marketing header, app topbar and
 * auth layout.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useT();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border/70 bg-card/40 p-0.5",
        className,
      )}
      role="group"
      aria-label={t("lang.label")}
    >
      <Globe className="mx-1 size-3.5 text-muted-foreground" aria-hidden />
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
            locale === l
              ? "bg-primary/15 text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
