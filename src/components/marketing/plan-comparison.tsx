"use client";

import { Check, Minus } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Val = boolean | { en: string; ru: string };
interface Row {
  label: { en: string; ru: string };
  free: Val;
  premium: Val;
  concierge: Val;
}

const ROWS: Row[] = [
  { label: { en: "University search & explorer", ru: "Поиск и обзор вузов" }, free: true, premium: true, concierge: true },
  { label: { en: "Save universities & shortlist", ru: "Сохранение и шорт-лист" }, free: true, premium: true, concierge: true },
  { label: { en: "AI mentor messages", ru: "Сообщения AI-ментору" }, free: { en: "5 / day", ru: "5 / день" }, premium: { en: "Unlimited", ru: "Безлимит" }, concierge: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Admission chance assessment", ru: "Оценка шансов" }, free: { en: "Limited", ru: "Ограничено" }, premium: { en: "Unlimited", ru: "Безлимит" }, concierge: { en: "Unlimited", ru: "Безлимит" } },
  { label: { en: "Personalized roadmap", ru: "Персональный роадмап" }, free: false, premium: true, concierge: true },
  { label: { en: "Essay review & AI feedback", ru: "Проверка эссе с AI" }, free: false, premium: true, concierge: true },
  { label: { en: "Scholarship finder & alerts", ru: "Поиск стипендий" }, free: false, premium: true, concierge: true },
  { label: { en: "Deadline tracking & planner", ru: "Дедлайны и планировщик" }, free: false, premium: true, concierge: true },
  { label: { en: "Full program database", ru: "Полная база программ" }, free: false, premium: true, concierge: true },
  { label: { en: "7-day free trial", ru: "7 дней бесплатно" }, free: false, premium: true, concierge: true },
  { label: { en: "1:1 human counselor", ru: "Личный консультант 1:1" }, free: false, premium: false, concierge: true },
  { label: { en: "Application review before submission", ru: "Проверка заявки перед подачей" }, free: false, premium: false, concierge: true },
  { label: { en: "Interview preparation", ru: "Подготовка к интервью" }, free: false, premium: false, concierge: true },
  { label: { en: "Visa & relocation guidance", ru: "Виза и переезд" }, free: false, premium: false, concierge: true },
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

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur-sm">
          <div className="grid grid-cols-4 border-b border-border/70 bg-card/40 px-6 py-4 text-sm font-semibold">
            <span className="col-span-1">{lang === "ru" ? "Сравнение планов" : "Compare plans"}</span>
            <span className="text-center">{lang === "ru" ? "Бесплатно" : "Free"}<span className="block text-xs font-normal text-muted-foreground">{lang === "ru" ? "0 ₽" : "$0"}</span></span>
            <span className="text-center text-primary">Premium<span className="block text-xs font-normal text-muted-foreground">$15/mo</span></span>
            <span className="text-center">{lang === "ru" ? "Консьерж" : "Concierge"}<span className="block text-xs font-normal text-muted-foreground">$119/mo</span></span>
          </div>
          {ROWS.map((row, i) => (
            <div key={row.label.en} className={cn("grid grid-cols-4 items-center px-6 py-3.5 text-sm", i % 2 && "bg-card/20")}>
              <span className="text-foreground/85">{row.label[lang]}</span>
              <div className="text-center"><Cell value={row.free} lang={lang} /></div>
              <div className="text-center"><Cell value={row.premium} lang={lang} /></div>
              <div className="text-center"><Cell value={row.concierge} lang={lang} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
