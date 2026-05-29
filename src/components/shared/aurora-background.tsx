import { cn } from "@/lib/utils";

/**
 * Ambient background: two soft, static gradient blobs + a faint grid.
 * Purely decorative; sits behind content with pointer-events disabled.
 * Intentionally static — moving large-blur layers are expensive to composite,
 * and a restrained, still gradient reads more premium (Linear/Stripe style).
 */
export function AuroraBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "subtle" | "hero";
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />

      <div
        className={cn(
          "absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-[110px]",
          "bg-[radial-gradient(circle_at_center,hsl(var(--brand-blue)/0.28),transparent_60%)]",
          variant === "subtle" && "opacity-50",
        )}
      />
      <div
        className="absolute top-24 -left-32 h-[30rem] w-[30rem] rounded-full blur-[110px] bg-[radial-gradient(circle_at_center,hsl(var(--brand-indigo)/0.20),transparent_60%)]"
      />
      {variant === "hero" && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}
    </div>
  );
}
