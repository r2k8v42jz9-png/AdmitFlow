"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, MapPin, TrendingUp } from "lucide-react";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";
import { formatCurrency, cn } from "@/lib/utils";
import type { University } from "@/lib/types";
import type { MatchClassification } from "@/lib/supabase/match";

/** Returns an i18n key (`uni.band.*`) + chip class for an admission probability. */
export function admissionBand(p: number) {
  if (p < 35) return { key: "uni.band.reach", className: "bg-destructive/15 text-destructive" };
  if (p <= 65) return { key: "uni.band.target", className: "bg-warning/15 text-warning" };
  return { key: "uni.band.likely", className: "bg-success/15 text-success" };
}

/** Same chip styling as admissionBand(), keyed off a Smart Match classification instead. */
function matchBand(c: MatchClassification) {
  if (c === "reach") return { key: "uni.band.reach", className: "bg-destructive/15 text-destructive" };
  if (c === "target") return { key: "uni.band.target", className: "bg-warning/15 text-warning" };
  return { key: "uni.band.likely", className: "bg-success/15 text-success" };
}

export function UniversityCard({
  university,
  saved,
  onToggleSave,
  index = 0,
  classification,
  matchScore,
}: {
  university: University;
  saved: boolean;
  onToggleSave: (id: string) => void;
  index?: number;
  /** When provided (Smart Match), overrides the generic fit/band with a personalized one. */
  classification?: MatchClassification;
  matchScore?: number;
}) {
  const { t } = useT();
  const u = university;
  const band = classification ? matchBand(classification) : admissionBand(u.admissionProbability);
  const bandPercent = matchScore ?? u.admissionProbability;
  const fitValue = matchScore ?? u.fitScore;

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
              aria-label={saved ? t("uni.removeBookmark") : t("uni.saveUniversity")}
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
            <Metric label={t("uni.fit")} value={`${fitValue}`} tone="text-success" />
            <Metric label={t("uni.accept")} value={`${u.acceptanceRate}%`} />
            <Metric
              label={t("uni.tuition")}
              value={u.tuitionPerYear === 0 ? t("uni.free") : formatCurrency(u.tuitionPerYear, u.currency).replace(/\.00$/, "")}
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
              <TrendingUp className="size-3" /> {t(band.key)} · {bandPercent}%
            </span>
            <Link
              href={`/universities/${u.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("uni.details")}
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
