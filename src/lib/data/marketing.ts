import type { PricingTier } from "@/lib/types";

export const heroStats = [
  { key: "students", value: 128000, suffix: "+" },
  { key: "uplift", value: 3.2, suffix: "×" },
  { key: "partners", value: 1400, suffix: "+" },
  { key: "scholarships", value: 92, suffix: "M", prefix: "$" },
];

export const universityLogos = [
  "Stanford",
  "MIT",
  "Oxford",
  "Cambridge",
  "ETH Zürich",
  "NUS",
  "Toronto",
  "TUM",
  "UCL",
  "Melbourne",
  "Tsinghua",
  "EPFL",
];

export const featureCards = [
  { key: "mentor", icon: "MessageSquare", accent: "from-brand-blue/20 to-brand-indigo/5" },
  { key: "chance", icon: "Target", accent: "from-brand-indigo/20 to-brand-blue/5" },
  { key: "plan", icon: "Map", accent: "from-brand-blue/20 to-brand-indigo/5" },
  { key: "shortlist", icon: "Building2", accent: "from-brand-indigo/20 to-brand-blue/5" },
  { key: "essay", icon: "FileText", accent: "from-brand-blue/20 to-brand-indigo/5" },
  { key: "deadlines", icon: "CalendarClock", accent: "from-brand-indigo/20 to-brand-blue/5" },
];

export const testimonials = [
  { key: "maya", name: "Maya Rashidova", avatar: "MR", accent: "from-brand-blue to-brand-cyan" },
  { key: "daniel", name: "Daniel Okafor", avatar: "DO", accent: "from-brand-violet to-brand-pink" },
  { key: "sofia", name: "Sofia Bianchi", avatar: "SB", accent: "from-brand-indigo to-brand-violet" },
  { key: "arjun", name: "Arjun Mehta", avatar: "AM", accent: "from-brand-cyan to-brand-blue" },
  { key: "lina", name: "Lina Hofmann", avatar: "LH", accent: "from-brand-pink to-brand-violet" },
  { key: "chen", name: "Chen Wei", avatar: "CW", accent: "from-brand-blue to-brand-indigo" },
];

export const faqs = [
  {
    q: "How accurate is the admission chance assessment?",
    a: "We benchmark your profile against published acceptance rates and historical admitted-student data, then calibrate the result. It produces an honest probability range, not a guarantee — but students who plan around it report list decisions that are 3.2× more likely to convert to offers.",
  },
  {
    q: "Is AdmitFlow only for US universities?",
    a: "No. We cover 1,400+ universities across the US, UK, Canada, Europe, Asia and Australia — with country-specific deadlines, tuition in local currency, visa notes and scholarship databases.",
  },
  {
    q: "Will you write my essays for me?",
    a: "Never. We give structural feedback, brainstorming prompts and paragraph-level suggestions so your authentic voice comes through — exactly the way admissions readers want it.",
  },
  {
    q: "How much does AdmitFlow cost?",
    a: "AdmitFlow is free forever for university search, saving universities, a basic dashboard and a limited AI mentor (3 messages a day). Pro is $7.99/month (or $83.88/year) and unlocks the unlimited AI mentor, unlimited chance assessment, your roadmap, deadlines, scholarship finder and application tracking. Max ($15/month or $156/year) adds priority AI, advanced analytics and premium admissions tools.",
  },
  {
    q: "Do you work with school counselors?",
    a: "Absolutely. Premium Mentor pairs you with a human admissions expert and lets you share your dashboard with counselors and parents for collaborative planning.",
  },
  {
    q: "How is my data protected?",
    a: "Your documents and profile are encrypted at rest and in transit. We never sell your data, and you can export or delete everything at any time from Settings.",
  },
];

export const faqsRu = [
  {
    q: "Насколько точна оценка шансов на поступление?",
    a: "Мы сопоставляем ваш профиль с опубликованными показателями приёма и историческими данными о зачисленных студентах, затем калибруем результат. Это честный диапазон вероятности, а не гарантия — но студенты, которые планируют с его учётом, принимают решения о списке вузов в 3,2 раза эффективнее.",
  },
  {
    q: "AdmitFlow только для вузов США?",
    a: "Нет. Мы охватываем 1 400+ университетов в США, Великобритании, Канаде, Европе, Азии и Австралии — со сроками по странам, стоимостью обучения в местной валюте, визовыми заметками и базами стипендий.",
  },
  {
    q: "Вы пишете эссе за меня?",
    a: "Никогда. Мы даём обратную связь по структуре, идеи и предложения на уровне абзацев, чтобы сохранить ваш собственный голос — именно так, как ценят приёмные комиссии.",
  },
  {
    q: "Сколько стоит AdmitFlow?",
    a: "AdmitFlow бесплатен навсегда: поиск вузов, сохранение университетов, базовая панель и ограниченный ИИ-наставник (3 сообщения в день). Pro стоит $7.99/мес (или $83.88/год) и открывает безлимитного ИИ-наставника, безлимитную оценку шансов, персональный план, дедлайны, поиск стипендий и трекер заявок. Max ($15/мес или $156/год) добавляет приоритетный ИИ, расширенную аналитику и премиум-инструменты поступления.",
  },
  {
    q: "Вы работаете со школьными консультантами?",
    a: "Конечно. Premium Mentor закрепляет за вами эксперта по поступлению и позволяет делиться панелью с консультантами и родителями для совместного планирования.",
  },
  {
    q: "Как защищены мои данные?",
    a: "Ваши документы и профиль шифруются при хранении и передаче. Мы никогда не продаём ваши данные, и вы можете экспортировать или удалить всё в любой момент в настройках.",
  },
];

/**
 * The three AdmitFlow plans, localized. `id` doubles as the plan kind (kept
 * stable so entitlements + checkout logic are unaffected):
 *   free → FREE    · $0      — explore universities
 *   pro  → PREMIUM · $9/mo   — full applications toolkit (recommended)
 *   max  → ELITE   · $49/mo  — expert-led admission support (contact sales)
 */
export function getPricingTiers(locale: "en" | "ru"): PricingTier[] {
  const ru = locale === "ru";
  return [
    {
      id: "free",
      name: ru ? "Бесплатно" : "Free",
      price: { monthly: 0, yearly: 0 },
      tagline: ru ? "Изучайте университеты и рассчитывайте свои шансы на поступление." : "Explore universities and calculate your admission chances.",
      cta: ru ? "Начать бесплатно" : "Start Free",
      variant: "secondary",
      features: ru
        ? ["Поиск университетов", "Калькулятор шансов на поступление", "Базовый ИИ-наставник", "Сохранение до 5 университетов", "Доступ к панели"]
        : ["University Search", "Admission Chance Calculator", "Basic AI Mentor", "Save up to 5 Universities", "Dashboard Access"],
    },
    {
      id: "pro",
      name: ru ? "Премиум" : "Premium",
      price: { monthly: 9, yearly: 108 },
      tagline: ru ? "Всё необходимое для серьёзного поступления в университет." : "Everything needed for serious university admissions.",
      highlight: true,
      popular: true,
      badge: ru ? "⭐ Рекомендуем" : "⭐ Recommended",
      cta: ru ? "Выбрать Премиум" : "Choose Premium",
      variant: "primary",
      features: ru
        ? ["Безлимитный ИИ-наставник", "Поиск стипендий", "Персональный план поступления", "Отслеживание дедлайнов", "Неограниченно университетов", "Трекер прогресса заявок"]
        : ["Unlimited AI Mentor", "Scholarship Finder", "Personalized Admission Plan", "Deadline Tracking", "Unlimited Universities", "Application Progress Tracker"],
    },
    {
      id: "max",
      name: ru ? "Элит" : "Elite",
      price: { monthly: 49, yearly: 588 },
      tagline: ru ? "Полное сопровождение поступления от экспертов." : "Full admissions support from experts.",
      cta: ru ? "Связаться с нами" : "Contact Us",
      variant: "primary",
      contact: true,
      features: ru
        ? ["Проверка эссе", "Консультант 1-на-1", "Стратегия поступления", "Приоритетная поддержка", "Подготовка к собеседованию", "Личный коуч по поступлению"]
        : ["Essay Review", "1-on-1 Consultant", "Admission Strategy", "Priority Support", "Interview Preparation", "Personal Admissions Coach"],
    },
  ];
}

export const trustBadges = ["SOC 2 Type II", "FERPA aligned", "GDPR ready", "256-bit encryption"];
