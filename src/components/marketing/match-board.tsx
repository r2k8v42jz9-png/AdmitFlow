"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The hero's signature element: AdmitFlow's match engine, live. Universities are
 * scored against the student's profile, their fit bars fill, admission odds count
 * up, and the list physically RE-SORTS by probability into a ranked Reach /
 * Target / Safety shortlist. This is the product's core decision moment — not a
 * decorative background. Re-runs on a gentle loop so it feels alive.
 */

type Tier = "Reach" | "Target" | "Safety";

interface Uni {
  id: string;
  name: string;
  cc: string; // country code shown in the node ring
  fit: number; // 0..100
  prob: number; // admission probability 0..100
  tier: Tier;
}

const UNIS: Uni[] = [
  { id: "mit", name: "MIT", cc: "US", fit: 79, prob: 38, tier: "Reach" },
  { id: "oxford", name: "Oxford", cc: "UK", fit: 83, prob: 47, tier: "Reach" },
  { id: "eth", name: "ETH Zürich", cc: "CH", fit: 91, prob: 86, tier: "Target" },
  { id: "nus", name: "NUS", cc: "SG", fit: 88, prob: 81, tier: "Target" },
  { id: "tum", name: "TU München", cc: "DE", fit: 85, prob: 77, tier: "Target" },
  { id: "toronto", name: "Toronto", cc: "CA", fit: 86, prob: 93, tier: "Safety" },
];

const ENTERED = UNIS.map((u) => u.id);
const RANKED = [...UNIS].sort((a, b) => b.prob - a.prob).map((u) => u.id);

const tierStyle: Record<Tier, string> = {
  Reach: "bg-warning/12 text-warning ring-warning/25",
  Target: "bg-primary/12 text-primary ring-primary/25",
  Safety: "bg-success/12 text-success ring-success/25",
};

function Counter({ value, run }: { value: number; run: boolean }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    if (!run) return;
    const controls = animate(mv, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [run, value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export function MatchBoard() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [order, setOrder] = useState<string[]>(ENTERED);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!inView) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRun(true);
    if (reduce) {
      setOrder(RANKED);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setOrder(RANKED), 1200));
    const loop = setInterval(() => {
      setOrder(ENTERED);
      timers.push(setTimeout(() => setOrder(RANKED), 900));
    }, 7200);
    return () => {
      clearInterval(loop);
      timers.forEach(clearTimeout);
    };
  }, [inView, reduce]);

  const items = order.map((id) => UNIS.find((u) => u.id === id)!);

  return (
    <div ref={ref} className="glass-strong relative overflow-hidden rounded-[1.6rem] p-5 shadow-[0_44px_100px_-50px_hsl(224_60%_30%/0.45)] sm:p-6">
      {/* header — the inputs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <svg viewBox="0 0 24 24" fill="none" className="size-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l3 8 4-16 3 8h4" />
            </svg>
          </span>
          <div>
            <p className="font-display text-[15px] font-medium leading-none">Match engine</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Scoring your profile against 61 universities</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
          <span className="size-1.5 animate-pulse rounded-full bg-success" /> Live
        </span>
      </div>

      {/* profile chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["GPA 3.9", "IELTS 8.0", "SAT 1520", "Computer Science"].map((c) => (
          <span key={c} className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-foreground/70">
            {c}
          </span>
        ))}
      </div>

      {/* the live ranked list */}
      <ul className="mt-4 space-y-1.5">
        {items.map((u, i) => (
          <motion.li
            key={u.id}
            layout
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-center gap-3 rounded-xl border border-transparent bg-card/70 px-3 py-2.5 transition-colors hover:border-border hover:bg-card"
          >
            <span className="w-4 shrink-0 text-center font-display text-sm font-medium tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/8 text-[10px] font-semibold text-primary ring-1 ring-primary/15">
              {u.cc}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-display text-[15px] font-medium">{u.name}</span>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1", tierStyle[u.tier])}>
                  {u.tier}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: run ? `${u.fit}%` : 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.07 }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-indigo)),hsl(var(--brand-cyan)))]"
                />
              </div>
            </div>
            <div className="w-12 shrink-0 text-right">
              <span className="font-display text-lg font-semibold tabular-nums leading-none text-foreground">
                <Counter value={u.prob} run={run} />
              </span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* footer — the decision */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3.5">
        <p className="text-[11px] text-muted-foreground">Balanced shortlist · 2 reach · 3 target · 1 safety</p>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
          Ranked by your odds
          <svg viewBox="0 0 24 24" fill="none" className="size-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
