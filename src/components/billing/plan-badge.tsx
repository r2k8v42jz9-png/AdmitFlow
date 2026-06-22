"use client";

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { useEntitlements } from "@/lib/entitlements";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Compact plan indicator for the app shell.
 *  - max  → "Max" pill (no upgrade prompt)
 *  - pro  → "Pro" pill (no upgrade prompt)
 *  - free → "Upgrade" link to pricing (the only tier that sees upsell)
 */
export function PlanBadge({ className }: { className?: string }) {
  const ent = useEntitlements();
  const { t } = useT();

  if (ent.isPaid) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary",
          className,
        )}
      >
        <Crown className="size-3.5" /> {ent.isMax ? "Max" : "Pro"}
      </span>
    );
  }

  return (
    <Link
      href="/pricing"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-[linear-gradient(110deg,hsl(var(--brand-indigo)/0.12),hsl(var(--brand-cyan)/0.12))] px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:border-primary/50",
        className,
      )}
    >
      <Sparkles className="size-3.5" /> {t("plan.upgrade")}
    </Link>
  );
}
