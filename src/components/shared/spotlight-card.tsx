"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card that reveals a soft radial highlight following the cursor — the
 * "premium hover" effect used across the product surfaces.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "hsl(var(--primary) / 0.16)",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: "div" | "article" | "a";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  return (
    <Tag
      ref={ref as never}
      onMouseMove={(e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
