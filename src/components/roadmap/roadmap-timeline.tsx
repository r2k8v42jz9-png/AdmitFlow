"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, Loader2, CalendarClock, Target, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DynamicIcon } from "@/components/shared/icon";
import { useUser } from "@/lib/user-store";
import { generateRoadmap } from "@/lib/roadmap-engine";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { RoadmapMilestone } from "@/lib/types";

const statusStyle = {
  done: "border-success/40 bg-success/15 text-success",
  active: "border-primary/50 bg-primary/15 text-primary",
  upcoming: "border-border bg-card/60 text-muted-foreground",
} as const;

export function RoadmapTimeline() {
  const { t } = useT();
  const { onboarding } = useUser();
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);

  const intake = onboarding?.targetIntake || "Not set";
  const major = onboarding?.intendedMajor || "your field";

  const generated = useMemo(() => generateRoadmap(onboarding), [onboarding]);
  const milestones = useMemo<RoadmapMilestone[]>(
    () =>
      generated.map((m) => ({
        ...m,
        tasks: m.tasks.map((t) => (t.id in overrides ? { ...t, done: overrides[t.id] } : t)),
      })),
    [generated, overrides],
  );

  const { done, total } = useMemo(() => {
    const all = milestones.flatMap((m) => m.tasks);
    return { done: all.filter((t) => t.done).length, total: all.length };
  }, [milestones]);

  const pct = total ? Math.round((done / total) * 100) : 0;
  const activeMilestone = milestones.find((m) => m.status === "active") ?? milestones[0];

  const toggleTask = (milestoneId: string, taskId: string) => {
    const current = milestones.flatMap((m) => m.tasks).find((t) => t.id === taskId)?.done ?? false;
    setOverrides((o) => ({ ...o, [taskId]: !current }));
  };

  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setOverrides({});
      setGenerating(false);
    }, 1600);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard icon={Target} label={t("roadmap.targetIntake")} value={intake} sub={major} />
        <SummaryCard
          icon={CalendarClock}
          label={t("roadmap.currentPhase")}
          value={activeMilestone.title}
          sub={activeMilestone.window}
        />
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <ListChecks className="size-4" /> {t("roadmap.overall")}
            </span>
            <span className="font-display text-sm font-bold tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            {done} of {total} tasks complete
          </p>
        </Card>
      </div>

      {/* Regenerate banner */}
      <Card className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="font-medium">AI-generated roadmap</p>
            <p className="text-sm text-muted-foreground">
              Tailored to your profile and {intake} target. Check off tasks as you go.
            </p>
          </div>
        </div>
        <Button variant="gradient" onClick={regenerate} disabled={generating} className="shrink-0">
          {generating ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> {t("roadmap.regenerate")}
            </>
          )}
        </Button>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pl-12"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border border-border/50 bg-card/40" />
              ))}
            </motion.div>
          ) : (
            <motion.div key="timeline" className="space-y-5">
              {milestones.map((m, i) => (
                <MilestoneCard key={m.id} milestone={m} index={i} onToggle={toggleTask} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone: m,
  index,
  onToggle,
}: {
  milestone: RoadmapMilestone;
  index: number;
  onToggle: (milestoneId: string, taskId: string) => void;
}) {
  const doneCount = m.tasks.filter((t) => t.done).length;
  const pct = m.tasks.length ? Math.round((doneCount / m.tasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.4) }}
      className="relative flex gap-5"
    >
      <span
        className={cn(
          "relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border",
          statusStyle[m.status],
          m.status === "active" && "shadow-glow",
        )}
      >
        {m.status === "done" ? <Check className="size-5" /> : <DynamicIcon name={m.icon} className="size-5" />}
      </span>

      <Card className="flex-1 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold">{m.title}</h3>
            {m.status === "active" && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">In progress</span>
            )}
            {m.status === "done" && (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">Complete</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{m.window}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{m.description}</p>

        <div className="mt-3 flex items-center gap-3">
          <Progress value={pct} className="h-1.5" />
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {doneCount}/{m.tasks.length}
          </span>
        </div>

        <ul className="mt-4 space-y-1.5">
          {m.tasks.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onToggle(m.id, t.id)}
                className="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                    t.done
                      ? "border-success bg-success text-white"
                      : "border-border group-hover:border-primary/60",
                  )}
                >
                  {t.done && <Check className="size-3.5" />}
                </span>
                <span className={cn("transition-colors", t.done ? "text-muted-foreground line-through" : "text-foreground")}>
                  {t.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-4">
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-4" /> {label}
      </span>
      <p className="mt-2 font-display text-base font-bold leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </Card>
  );
}
