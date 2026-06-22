"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, transitions, viewportOnce } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span" | "section";
  y?: number;
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } }}
      transition={{ ...transitions.base, delay }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp} transition={transitions.base}>
      {children}
    </motion.div>
  );
}
