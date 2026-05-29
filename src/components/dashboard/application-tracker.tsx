"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { applications, statusMeta } from "@/lib/data/app";
import { getUniversity } from "@/lib/data/universities";
import { relativeDeadline, cn } from "@/lib/utils";

export function ApplicationTracker({ limit }: { limit?: number }) {
  const items = limit ? applications.slice(0, limit) : applications;

  return (
    <div className="space-y-2.5">
      {items.map((app, i) => {
        const uni = getUniversity(app.universityId);
        const meta = statusMeta[app.status];
        const dl = relativeDeadline(app.deadline);
        if (!uni) return null;
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/universities/${uni.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/70"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/60 text-xl">
                {uni.flag}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{uni.shortName}</p>
                  <span className={cn("flex items-center gap-1.5 text-xs font-medium", meta.tone)}>
                    <span className={cn("size-1.5 rounded-full", meta.dot)} />
                    {meta.label}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{app.program} · {app.round}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={app.progress} className="h-1.5 flex-1" />
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {app.tasksDone}/{app.tasksTotal}
                  </span>
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <span
                  className={cn(
                    "text-xs font-medium",
                    dl.tone === "danger" ? "text-destructive" : dl.tone === "warning" ? "text-warning" : "text-muted-foreground",
                  )}
                >
                  {dl.label}
                </span>
                <ArrowUpRight className="ml-auto mt-1 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
