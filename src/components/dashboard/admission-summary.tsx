"use client";

import Link from "next/link";
import { Gauge, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useSavedUniversityDetails } from "@/lib/saved-universities";
import { useEntitlements } from "@/lib/entitlements";
import { openUpgrade } from "@/lib/upgrade-store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { University } from "@/lib/types";

function band(p: number, ru: boolean) {
  if (p < 35) return { label: ru ? "Риск" : "Reach", tone: "text-warning", bar: "bg-warning" };
  if (p <= 65) return { label: ru ? "Цель" : "Target", tone: "text-primary", bar: "bg-primary" };
  return { label: ru ? "Надёжно" : "Safety", tone: "text-success", bar: "bg-success" };
}

export function AdmissionSummary() {
  const { universities } = useSavedUniversityDetails();
  const ent = useEntitlements();
  const { locale } = useT();
  const ru = locale === "ru";

  if (universities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="size-4 text-primary" /> {ru ? "Шансы на поступление" : "Admission probability"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Gauge}
            title={ru ? "Пока нет оценок" : "No assessments yet"}
            body={ru ? "Сохраните вузы, чтобы увидеть ваши шансы." : "Save universities to see your chances."}
            ctaLabel={ru ? "Открыть вузы" : "Explore universities"}
            ctaHref="/universities"
          />
        </CardContent>
      </Card>
    );
  }

  const sorted = [...universities].sort((a, b) => b.admissionProbability - a.admissionProbability);
  const avg = Math.round(sorted.reduce((s, u) => s + u.admissionProbability, 0) / sorted.length);
  const reach = sorted.filter((u) => u.admissionProbability < 35).length;
  const target = sorted.filter((u) => u.admissionProbability >= 35 && u.admissionProbability <= 65).length;
  const safety = sorted.filter((u) => u.admissionProbability > 65).length;

  // Free tier sees a couple of universities; the rest is a Premium upsell.
  const FREE_VISIBLE = 2;
  const visible: University[] = ent.hasPremiumAccess ? sorted : sorted.slice(0, FREE_VISIBLE);
  const hiddenCount = sorted.length - visible.length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Gauge className="size-4 text-primary" /> {ru ? "Шансы на поступление" : "Admission probability"}
        </CardTitle>
        <div className="text-right">
          <span className="font-display text-2xl font-semibold tabular-nums">{avg}%</span>
          <p className="text-[11px] text-muted-foreground">{ru ? "средний шанс" : "average chance"}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* tier distribution */}
        <div className="flex gap-2 text-center text-xs">
          <div className="flex-1 rounded-lg bg-warning/10 py-2">
            <p className="font-display text-lg font-semibold tabular-nums text-warning">{reach}</p>
            <p className="text-muted-foreground">{ru ? "Риск" : "Reach"}</p>
          </div>
          <div className="flex-1 rounded-lg bg-primary/10 py-2">
            <p className="font-display text-lg font-semibold tabular-nums text-primary">{target}</p>
            <p className="text-muted-foreground">{ru ? "Цель" : "Target"}</p>
          </div>
          <div className="flex-1 rounded-lg bg-success/10 py-2">
            <p className="font-display text-lg font-semibold tabular-nums text-success">{safety}</p>
            <p className="text-muted-foreground">{ru ? "Надёжно" : "Safety"}</p>
          </div>
        </div>

        {/* per-university bars */}
        <ul className="space-y-2.5">
          {visible.map((u) => {
            const b = band(u.admissionProbability, ru);
            return (
              <li key={u.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-sm font-medium">{u.shortName}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", b.bar)} style={{ width: `${u.admissionProbability}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums">{u.admissionProbability}%</span>
              </li>
            );
          })}
        </ul>

        {hiddenCount > 0 && (
          <button
            onClick={() => openUpgrade("chance-limit")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Lock className="size-3.5" />
            {ru ? `Открыть ещё ${hiddenCount} в Premium` : `Unlock ${hiddenCount} more with Premium`}
          </button>
        )}

        {ent.hasPremiumAccess && (
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/roadmap">{ru ? "Открыть полный план" : "Open full plan"}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
