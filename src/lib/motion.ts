import type { Transition, Variants } from "framer-motion";

/**
 * Reusable Framer Motion animation system.
 *
 * All entrance variants animate ONLY `opacity` + transform (`y`/`scale`), so they
 * never change document flow — no layout shifts. Combined with
 * <MotionProvider> (`MotionConfig reducedMotion="user"`), the transform parts are
 * dropped automatically when the OS requests reduced motion, leaving a gentle fade.
 */

/** Editorial easing used across the product. */
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Transition presets. */
export const transitions = {
  base: { duration: 0.6, ease: easeOut },
  slow: { duration: 0.9, ease: easeOut },
  snappy: { duration: 0.45, ease: easeOut },
} satisfies Record<string, Transition>;

/** whileInView config — fire once, just before fully on screen. */
export const viewportOnce = { once: true, margin: "-60px" } as const;

/* ---- Entrance variants (opacity + transform only) ---------------------- */
export const fadeIn: Variants = { hidden: { opacity: 0 }, show: { opacity: 1 } };
export const fadeUp: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
export const fadeUpLg: Variants = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } };
export const scaleIn: Variants = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } };

/** Orchestration: stagger child reveals. Children use one of the variants above. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});
