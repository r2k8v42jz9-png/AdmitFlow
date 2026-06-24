"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Ripple button (21st.dev "multi-type ripple buttons").
 *
 * Renders a <button> by default, or an <a> when `href` is provided (used for the
 * Elite "Contact Us" mailto CTA). A material-style ripple is spawned on click via
 * the Web Animations API, so it needs no global keyframes — only `relative
 * overflow-hidden`, which is applied here.
 */
export interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  rippleColor?: string;
}

export function RippleButton({
  className,
  children,
  href,
  onClick,
  disabled,
  rippleColor = "rgba(255,255,255,0.45)",
  ...props
}: RippleButtonProps) {
  const spawnRipple = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.style.cssText = `position:absolute;border-radius:9999px;pointer-events:none;background:${rippleColor};width:${size}px;height:${size}px;left:${
      e.clientX - rect.left - size / 2
    }px;top:${e.clientY - rect.top - size / 2}px;`;
    el.appendChild(ripple);
    ripple
      .animate(
        [
          { transform: "scale(0)", opacity: 0.6 },
          { transform: "scale(2.2)", opacity: 0 },
        ],
        { duration: 600, easing: "ease-out" },
      )
      .addEventListener("finish", () => ripple.remove());
  };

  const classes = cn("relative overflow-hidden isolate", className);

  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => spawnRipple(e)}
        className={cn(classes, "inline-flex items-center justify-center")}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        spawnRipple(e);
        onClick?.(e);
      }}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
