"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

/**
 * AuroraLayer — the aurora as a pure background layer (no wrapper / base / centering),
 * for dropping into an existing section behind its content. Same visual as
 * AuroraBackground's effect: blue-only gradient, slow `animate-aurora`, blur-[32px],
 * opacity-[0.20], radial mask, no fog/haze. Place inside a `relative` section, e.g.
 * `<AuroraLayer className="-z-10" />`.
 */
export const AuroraLayer = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        style={
          {
            // Soft, non-repeating aurora: a few enormous overlapping blue ellipses
            // that blend into one ambient field — no stripes/beams, no single
            // identifiable circle. Same colors as before.
            "--aurora":
              "radial-gradient(80% 70% at 72% 2%, #4F7CFF 0%, transparent 60%), radial-gradient(85% 75% at 52% 12%, #A5C4FF 0%, transparent 62%), radial-gradient(70% 65% at 95% 22%, #7AA2FF 0%, transparent 58%), radial-gradient(75% 68% at 80% 42%, #4F7CFF 0%, transparent 64%)",
          } as React.CSSProperties
        }
        className={cn(
          `
          [background-image:var(--aurora)]
          [background-repeat:no-repeat]
          [background-size:100%_100%]
          blur-[32px]
          after:content-[""] after:absolute after:inset-0 after:[background-image:var(--aurora)]
          after:[background-repeat:no-repeat] after:[background-size:100%_100%]
          after:animate-aurora
          pointer-events-none
          absolute -inset-[10px] opacity-[0.20] will-change-transform
          [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
        )}
      ></div>
    </div>
  );
};

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            // Only the blue aurora remains — the white/dark gradient wash layers
            // that sat on top of it (the fog/haze) have been removed.
            className={cn(
              `
            [--transparent:transparent]
            [--aurora:repeating-linear-gradient(100deg,#4F7CFF_10%,#7AA2FF_15%,#A5C4FF_20%,#7AA2FF_25%,#4F7CFF_30%)]
            [background-image:var(--aurora)]
            [background-size:200%]
            [background-position:50%_50%]
            blur-[32px]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--aurora)]
            after:[background-size:100%]
            after:animate-aurora after:[background-attachment:fixed]
            pointer-events-none
            absolute -inset-[10px] opacity-[0.20] will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
