"use client";

import Link from "next/link";
import { Crown, Sparkles, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/lib/entitlements";
import { useT } from "@/lib/i18n";

const PAID_FEATURES = {
  en: {
    pro: ["Unlimited AI Mentor", "Unlimited chance assessment", "Roadmap & deadlines", "Scholarship finder", "Application tracking"],
    max: ["Everything in Pro", "Priority AI", "Advanced analytics", "Premium admissions tools", "Early access to new features"],
  },
  ru: {
    pro: ["Безлимитный ИИ-наставник", "Безлимитная оценка шансов", "План и дедлайны", "Поиск стипендий", "Трекер заявок"],
    max: ["Всё из Pro", "Приоритетный ИИ", "Расширенная аналитика", "Премиум-инструменты", "Ранний доступ к функциям"],
  },
};

export function PlanStatusCard() {
  const ent = useEntitlements();
  const { t, locale } = useT();
  const ru = locale === "ru";

  // ----- Paid (Pro / Max) — clean status, no upsell -----
  if (ent.isPaid) {
    const feats = ru ? PAID_FEATURES.ru : PAID_FEATURES.en;
    const list = ent.isMax ? feats.max : feats.pro;
    const planName = ent.isMax ? "Max" : "Pro";
    return (
      <Card className="overflow-hidden">
        <div className="bg-[linear-gradient(135deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_60%,hsl(var(--brand-cyan)))] px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Crown className="size-4" /> AdmitFlow {planName}
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">{t("plan.active")}</span>
          </div>
          <p className="mt-1 text-xs text-white/85">{ru ? "Все функции открыты" : "All features unlocked"}</p>
        </div>
        <CardContent className="p-5">
          <ul className="space-y-1.5">
            {list.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <Check className="size-3.5 text-success" /> {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  // ----- Free — current plan + upgrade CTA -----
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t("plan.free")}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{t("plan.active")}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {ru
            ? "Откройте безлимитного наставника, план, дедлайны и поиск стипендий с Pro."
            : "Unlock the unlimited mentor, roadmap, deadlines and scholarship finder with Pro."}
        </p>
        <Button asChild variant="gradient" size="sm" className="mt-4 w-full">
          <Link href="/pricing">
            <Sparkles className="size-4" /> {t("plan.upgrade")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
