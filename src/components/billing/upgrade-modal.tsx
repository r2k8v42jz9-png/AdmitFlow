"use client";

import Link from "next/link";
import { Crown, Check, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpgrade, closeUpgrade, type UpgradeReason } from "@/lib/upgrade-store";
import { useT } from "@/lib/i18n";

const COPY: Record<UpgradeReason, { en: { eyebrow: string; title: string; body: string }; ru: { eyebrow: string; title: string; body: string } }> = {
  "mentor-limit": {
    en: { eyebrow: "Daily limit reached", title: "Unlimited guidance with Premium", body: "You've used today's free mentor messages. Upgrade for unlimited, always-on admissions guidance." },
    ru: { eyebrow: "Дневной лимит исчерпан", title: "Безлимитный ментор в Premium", body: "Вы использовали бесплатные сообщения на сегодня. Откройте безлимитное общение с ментором." },
  },
  "chance-limit": {
    en: { eyebrow: "Free assessments used", title: "See every chance with Premium", body: "Run unlimited admission-chance assessments across all your target universities." },
    ru: { eyebrow: "Бесплатные оценки использованы", title: "Все шансы в Premium", body: "Безлимитная оценка шансов поступления по всем вашим вузам." },
  },
  "premium-feature": {
    en: { eyebrow: "Premium feature", title: "Unlock your full admissions toolkit", body: "Essay review, scholarship finder, deadline tracking and the full planner live in Premium." },
    ru: { eyebrow: "Premium-функция", title: "Полный набор инструментов", body: "Проверка эссе, поиск стипендий, дедлайны и планировщик доступны в Premium." },
  },
  "trial-ending": {
    en: { eyebrow: "Trial ending soon", title: "Keep your Premium access", body: "Don't lose unlimited mentor, essay review and your roadmap — continue with Premium." },
    ru: { eyebrow: "Пробный период заканчивается", title: "Сохраните доступ Premium", body: "Не теряйте безлимитного ментора, проверку эссе и роадмап — продолжите с Premium." },
  },
  generic: {
    en: { eyebrow: "AdmitFlow Premium", title: "Your complete admissions advantage", body: "Everything you need to go from uncertain to admitted — without limits." },
    ru: { eyebrow: "AdmitFlow Premium", title: "Полное преимущество в поступлении", body: "Всё, что нужно, чтобы дойти до зачисления — без ограничений." },
  },
};

const FEATURES = {
  en: ["Unlimited AI Mentor", "Unlimited chance assessments", "Essay review & AI feedback", "Scholarship finder", "Deadline tracking & planner", "Personalized roadmap"],
  ru: ["Безлимитный AI-ментор", "Безлимитная оценка шансов", "Проверка эссе с AI", "Поиск стипендий", "Дедлайны и планировщик", "Персональный роадмап"],
};

export function UpgradeModal() {
  const { open, reason } = useUpgrade();
  const { locale } = useT();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[reason][lang];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeUpgrade()}>
      <DialogContent hideClose className="max-w-md overflow-hidden p-0">
        <DialogTitle className="sr-only">{c.title}</DialogTitle>

        {/* Premium header */}
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_60%,hsl(var(--brand-cyan)))] px-6 py-7 text-white">
          <div className="absolute -right-8 -top-10 size-40 rounded-full bg-white/15 blur-2xl" />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] backdrop-blur">
            <Crown className="size-3.5" /> {c.eyebrow}
          </span>
          <h2 className="relative mt-3 font-display text-2xl font-semibold leading-tight">{c.title}</h2>
          <p className="relative mt-2 text-sm leading-relaxed text-white/85">{c.body}</p>
        </div>

        {/* Features */}
        <div className="px-6 py-5">
          <ul className="grid gap-2.5">
            {FEATURES[lang].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="size-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button asChild variant="gradient" size="lg" className="w-full" onClick={() => closeUpgrade()}>
              <Link href="/pricing">
                <Sparkles className="size-4" /> {lang === "ru" ? "Перейти на Premium" : "Upgrade to Premium"}
              </Link>
            </Button>
            <button
              onClick={() => closeUpgrade()}
              className="cursor-pointer text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {lang === "ru" ? "Может быть позже" : "Maybe later"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
