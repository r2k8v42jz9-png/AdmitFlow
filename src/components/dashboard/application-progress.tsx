"use client";

import { UserRound, Telescope, FileText, Send, GraduationCap, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/user-store";
import { useSavedUniversityDetails } from "@/lib/saved-universities";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ApplicationProgress() {
  const { onboarding } = useUser();
  const { universities } = useSavedUniversityDetails();
  const { locale } = useT();
  const ru = locale === "ru";

  const o = onboarding;
  const hasProfile = !!(o?.gpa != null || o?.intendedMajor);
  const hasTests = !!(o?.ielts != null || o?.sat != null);
  const hasShortlist = universities.length > 0;

  // Stage completion driven by real signals (essays/submission have no backing
  // data yet, so they read as upcoming rather than fabricated).
  const steps = [
    { icon: UserRound, label: ru ? "Профиль" : "Profile", done: hasProfile },
    { icon: Telescope, label: ru ? "Шорт-лист" : "Shortlist", done: hasShortlist },
    { icon: FileText, label: ru ? "Тесты" : "Tests", done: hasTests },
    { icon: Send, label: ru ? "Заявки" : "Applications", done: false },
    { icon: GraduationCap, label: ru ? "Решение" : "Decision", done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const activeIdx = steps.findIndex((s) => !s.done);
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{ru ? "Прогресс поступления" : "Application progress"}</CardTitle>
        <span className="text-sm font-semibold tabular-nums text-muted-foreground">{pct}%</span>
      </CardHeader>
      <CardContent>
        {/* connecting track */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
          <div
            className="absolute left-0 top-5 h-0.5 bg-[linear-gradient(90deg,hsl(var(--brand-indigo)),hsl(var(--brand-cyan)))] transition-[width] duration-500"
            style={{ width: `${(doneCount / (steps.length - 1)) * 100}%` }}
          />
          <ol className="relative grid grid-cols-5 gap-1">
            {steps.map((s, i) => {
              const isActive = i === activeIdx;
              return (
                <li key={s.label} className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full border bg-card transition-colors",
                      s.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary/50 text-primary shadow-[0_0_0_4px_hsl(var(--brand-blue)/0.12)]"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {s.done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                  </span>
                  <span className={cn("mt-2 text-[11px] font-medium", s.done || isActive ? "text-foreground" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
