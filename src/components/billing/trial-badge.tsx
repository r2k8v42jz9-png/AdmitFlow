"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { useEntitlements } from "@/lib/entitlements";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Compact subscription status pill for the app shell.
 *  - trial   → "Premium trial · N days left" (links to pricing)
 *  - premium → "Premium" (no link)
 *  - free    → renders nothing (the topbar already shows an Upgrade button)
 */
export function TrialBadge({ className }: { className?: string }) {
  const ent = useEntitlements();
  const { locale } = useT();
  const ru = locale === "ru";

  if (ent.isPremium) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary", className)}>
        <Crown className="size-3.5" /> Premium
      </span>
    );
  }

  if (ent.isTrial) {
    const days = ent.trialDaysLeft;
    const label = ru
      ? `Пробный Premium · ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`
      : `Premium trial · ${days} ${days === 1 ? "day" : "days"} left`;
    return (
      <Link
        href="/pricing"
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-[linear-gradient(110deg,hsl(var(--brand-indigo)/0.12),hsl(var(--brand-cyan)/0.12))] px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:border-primary/50",
          className,
        )}
        title={ru ? "Перейти на Premium" : "Upgrade to Premium"}
      >
        <Crown className="size-3.5" /> {label}
      </Link>
    );
  }

  return null;
}
