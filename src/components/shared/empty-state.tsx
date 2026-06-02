import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Neutral empty state for sections with no real user data yet.
 * Used across the dashboard so a brand-new account shows guidance, not mock data.
 */
export function EmptyState({
  icon: Icon,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/30 px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-full border border-border/60 bg-background/60 text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">{body}</p>
      {ctaLabel && ctaHref && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
