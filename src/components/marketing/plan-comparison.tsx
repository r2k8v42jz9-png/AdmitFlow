"use client";

import { Check, Minus } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Val = boolean | { en: string; ru: string };
interface Row {
  label: { en: string; ru: string };
  free: Val;
  pro: Val;
  max: Val;
}

const ROWS: Row[] = [
  { label: { en: "University Search", ru: "Поиск университетов" }, free: true, pro: true, max: true },
  { label: { en: "Admission Chance Calculator", ru: "Калькулятор шансов на поступление" }, free: true, pro: true, max: true },
  { label: { en: "Dashboard Access", ru: "Доступ к панели" }, free: true, pro: true, max: true },
  { label: { en: "AI Mentor", ru: "ИИ-наставник" }, free: { en: "Basic", ru: "Базовый" }, pro: { en: "Unlimited", ru: "Безлимит" }, max: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Saved Universities", ru: "Сохранённые университеты" }, free: { en: "Up to 5", ru: "До 5" }, pro: { en: "Unlimited", ru: "Безлимит" }, max: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Scholarship Finder", ru: "Поиск стипендий" }, free: false, pro: true, max: true },
  { label: { en: "Personalized Admission Plan", ru: "Персональный план поступления" }, free: false, pro: true, max: true },
  { label: { en: "Deadline Tracking", ru: "Отслеживание дедлайнов" }, free: false, pro: true, max: true },
  { label: { en: "Application Progress Tracker", ru: "Трекер прогресса заявок" }, free: false, pro: true, max: true },
  { label: { en: "Essay Review", ru: "Проверка эссе" }, free: false, pro: false, max: true },
  { label: { en: "1-on-1 Consultant", ru: "Консультант 1-на-1" }, free: false, pro: false, max: true },
  { label: { en: "Admission Strategy", ru: "Стратегия поступления" }, free: false, pro: false, max: true },
  { label: { en: "Interview Preparation", ru: "Подготовка к собеседованию" }, free: false, pro: false, max: true },
  { label: { en: "Personal Admissions Coach", ru: "Личный коуч по поступлению" }, free: false, pro: false, max: true },
  { label: { en: "Priority Support", ru: "Приоритетная поддержка" }, free: false, pro: false, max: true },
];

function Cell({ value, lang }: { value: Val; lang: "en" | "ru" }) {
  if (typeof value === "object") return <span className="text-[15px] font-medium text-foreground/80">{value[lang]}</span>;
  return value ? (
    <Check className="mx-auto size-[18px] text-success" />
  ) : (
    <Minus className="mx-auto size-[18px] text-muted-foreground/40" />
  );
}

export function PlanComparison() {
  const { locale } = useT();
  const lang = locale === "ru" ? "ru" : "en";
  const per = lang === "ru" ? "/мес" : "/mo";

  return (
    <section className="relative pt-2 pb-16 sm:pt-4 sm:pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_30px_74px_-30px_rgba(20,30,60,0.42)] backdrop-blur-[32px] dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_38px_88px_-30px_rgba(0,0,0,0.85)]">
          <div className="grid grid-cols-4 border-b border-black/[0.07] bg-white/40 px-8 py-5 text-[15px] font-semibold dark:border-white/10 dark:bg-white/[0.05]">
            <span className="col-span-1">{lang === "ru" ? "Сравнение планов" : "Compare plans"}</span>
            <span className="text-center">{lang === "ru" ? "Бесплатно" : "Free"}<span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">$0</span></span>
            <span className="text-center text-primary">{lang === "ru" ? "Премиум" : "Premium"}<span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">$9{per}</span></span>
            <span className="text-center">{lang === "ru" ? "Элит" : "Elite"}<span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">$49{per}</span></span>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.label.en}
              className={cn(
                "grid grid-cols-4 items-center px-8 py-[18px] text-[15px] transition-colors",
                i !== 0 && "border-t border-black/[0.06] dark:border-white/[0.07]",
                i % 2 === 1 && "bg-white/25 dark:bg-white/[0.02]",
              )}
            >
              <span className="text-foreground/85">{row.label[lang]}</span>
              <div className="text-center"><Cell value={row.free} lang={lang} /></div>
              <div className="text-center"><Cell value={row.pro} lang={lang} /></div>
              <div className="text-center"><Cell value={row.max} lang={lang} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
