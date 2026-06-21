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
  { label: { en: "University search & explorer", ru: "Поиск и обзор вузов" }, free: true, pro: true, max: true },
  { label: { en: "Save universities", ru: "Сохранение вузов" }, free: true, pro: true, max: true },
  { label: { en: "Basic dashboard", ru: "Базовая панель" }, free: true, pro: true, max: true },
  { label: { en: "AI mentor messages", ru: "Сообщения ИИ-наставнику" }, free: { en: "3 / day", ru: "3 / день" }, pro: { en: "Unlimited", ru: "Безлимит" }, max: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Admission chance assessment", ru: "Оценка шансов" }, free: { en: "Basic", ru: "Базовая" }, pro: { en: "Unlimited", ru: "Безлимит" }, max: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Personalized roadmap", ru: "Персональный план" }, free: false, pro: true, max: true },
  { label: { en: "Deadline tracking", ru: "Дедлайны и планировщик" }, free: false, pro: true, max: true },
  { label: { en: "Scholarship finder", ru: "Поиск стипендий" }, free: false, pro: true, max: true },
  { label: { en: "Application tracking", ru: "Трекер заявок" }, free: false, pro: true, max: true },
  { label: { en: "Priority AI", ru: "Приоритетный ИИ" }, free: false, pro: false, max: true },
  { label: { en: "Advanced analytics", ru: "Расширенная аналитика" }, free: false, pro: false, max: true },
  { label: { en: "Premium admissions tools", ru: "Премиум-инструменты поступления" }, free: false, pro: false, max: true },
  { label: { en: "Early access to new features", ru: "Ранний доступ к новым функциям" }, free: false, pro: false, max: true },
];

function Cell({ value, lang }: { value: Val; lang: "en" | "ru" }) {
  if (typeof value === "object") return <span className="text-sm text-foreground/80">{value[lang]}</span>;
  return value ? (
    <Check className="mx-auto size-4 text-success" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/50" />
  );
}

export function PlanComparison() {
  const { locale } = useT();
  const lang = locale === "ru" ? "ru" : "en";
  const per = lang === "ru" ? "/мес" : "/mo";

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur-sm">
          <div className="grid grid-cols-4 border-b border-border/70 bg-card/40 px-6 py-4 text-sm font-semibold">
            <span className="col-span-1">{lang === "ru" ? "Сравнение планов" : "Compare plans"}</span>
            <span className="text-center">{lang === "ru" ? "Бесплатно" : "Free"}<span className="block text-xs font-normal text-muted-foreground">$0</span></span>
            <span className="text-center text-primary">Pro<span className="block text-xs font-normal text-muted-foreground">$7.99{per}</span></span>
            <span className="text-center">Max<span className="block text-xs font-normal text-muted-foreground">$15{per}</span></span>
          </div>
          {ROWS.map((row, i) => (
            <div key={row.label.en} className={cn("grid grid-cols-4 items-center px-6 py-3.5 text-sm", i % 2 && "bg-card/20")}>
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
