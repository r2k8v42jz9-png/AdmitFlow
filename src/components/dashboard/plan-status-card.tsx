"use client";

import Link from "next/link";
import { Crown, Sparkles, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEntitlements, TRIAL_DAYS } from "@/lib/entitlements";
import { useT } from "@/lib/i18n";

const PREMIUM_FEATURES = {
  en: ["Unlimited AI Mentor", "Unlimited chance assessments", "Essay review", "Scholarship finder", "Deadline planner"],
  ru: ["Безлимитный AI-ментор", "Безлимитная оценка шансов", "Проверка эссе", "Поиск стипендий", "Планировщик дедлайнов"],
};

export function PlanStatusCard() {
  const ent = useEntitlements();
  const { locale } = useT();
  const ru = locale === "ru";
  const feats = ru ? PREMIUM_FEATURES.ru : PREMIUM_FEATURES.en;

  // ----- Premium (paid) -----
  if (ent.isPremium) {
    return (
      <Card className="overflow-hidden">
        <div className="bg-[linear-gradient(135deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_60%,hsl(var(--brand-cyan)))] px-5 py-4 text-white">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <Crown className="size-4" /> Premium
          </span>
          <p className="mt-1 text-xs text-white/85">{ru ? "Все функции открыты" : "All features unlocked"}</p>
        </div>
        <CardContent className="p-5">
          <ul className="space-y-1.5">
            {feats.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="size-3.5 text-success" /> {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  // ----- Trial -----
  if (ent.isTrial) {
    const used = TRIAL_DAYS - ent.trialDaysLeft;
    const pct = Math.min(100, Math.max(0, (used / TRIAL_DAYS) * 100));
    const daysLabel = ru
      ? `${ent.trialDaysLeft} ${ent.trialDaysLeft === 1 ? "день" : ent.trialDaysLeft < 5 ? "дня" : "дней"}`
      : `${ent.trialDaysLeft} ${ent.trialDaysLeft === 1 ? "day" : "days"}`;
    return (
      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_60%,hsl(var(--brand-cyan)))] px-5 py-4 text-white">
          <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Crown className="size-4" /> {ru ? "Пробный Premium" : "Premium trial"}
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">{daysLabel} {ru ? "осталось" : "left"}</span>
          </div>
          <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {ru ? "Сейчас вам доступно" : "You're using right now"}
          </p>
          <ul className="mt-2 space-y-1.5">
            {feats.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="size-3.5 text-success" /> {f}
              </li>
            ))}
          </ul>
          <Button asChild variant="gradient" size="sm" className="mt-4 w-full">
            <Link href="/pricing">
              <Sparkles className="size-4" /> {ru ? "Сохранить Premium" : "Keep Premium"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ----- Free -----
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{ru ? "Бесплатный план" : "Free plan"}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{ru ? "Активен" : "Active"}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {ru ? "Откройте безлимитного ментора, проверку эссе и оценку шансов." : "Unlock unlimited mentor, essay review and chance assessments."}
        </p>
        <Button asChild variant="gradient" size="sm" className="mt-4 w-full">
          <Link href="/pricing">
            <Crown className="size-4" /> {ru ? "Перейти на Premium" : "Upgrade to Premium"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
