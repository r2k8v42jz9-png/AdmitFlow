"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, TrendingUp } from "lucide-react";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { University } from "@/lib/types";

export function admissionBand(p: number) {
  if (p < 35) return { label: "Reach", className: "bg-destructive/15 text-destructive" };
  if (p <= 65) return { label: "Target", className: "bg-warning/15 text-warning" };
  return { label: "Likely", className: "bg-success/15 text-success" };
}

export function UniversityCard({
  university,
  saved,
  onToggleSave,
  index = 0,
}: {
  university: University;
  saved: boolean;
  onToggleSave: (id: string) => void;
  index?: number;
}) {
  const u = university;
  const band = admissionBand(u.admissionProbability);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <SpotlightCard className="h-full">
        <div className="flex h-full flex-col p-5">
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-50", u.accent)} />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl border border-border/60 bg-background/70 text-2xl">
                {u.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold leading-tight">{u.shortName}</h3>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    #{u.rankWorld}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {u.city}
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleSave(u.id)}
              aria-label={saved ? "Remove bookmark" : "Save university"}
              className={cn(
                "grid size-8 place-items-center rounded-lg border transition-colors",
                saved
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/70 bg-background/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Bookmark className={cn("size-4", saved && "fill-current")} />
            </button>
          </div>

          <p className="relative mt-3.5 line-clamp-2 text-sm text-muted-foreground">{u.blurb}</p>

          <div className="relative mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border/50 bg-background/30 p-3 text-center">
            <Metric label="Fit" value={`${u.fitScore}`} tone="text-success" />
            <Metric label="Accept" value={`${u.acceptanceRate}%`} />
            <Metric
              label="Tuition"
              value={u.tuitionPerYear === 0 ? "Free" : formatCurrency(u.tuitionPerYear, u.currency).replace(/\.00$/, "")}
              small
            />
          </div>

          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {u.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary" className="text-[11px]">
                {t}
              </Badge>
            ))}
          </div>

          <div className="relative mt-auto flex items-center justify-between pt-4">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", band.className)}>
              <TrendingUp className="size-3" /> {band.label} · {u.admissionProbability}%
            </span>
            <Link
              href={`/universities/${u.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Details
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function Metric({ label, value, tone, small }: { label: string; value: string; tone?: string; small?: boolean }) {
  return (
    <div>
      <p className={cn("font-display font-bold", small ? "text-sm" : "text-lg", tone)}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
