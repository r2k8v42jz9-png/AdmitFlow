"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every Framer Motion animation in the tree respect the OS
 * "Reduce motion" setting: transform + layout animations are skipped while
 * opacity fades are kept. Renders no DOM — purely a context provider, so it
 * introduces no layout change.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
