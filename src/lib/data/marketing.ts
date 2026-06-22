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
 * The three AdmitFlow plans, localized. `id` doubles as the plan kind:
 *   free → permanent free access (no checkout, no expiration)
 *   pro  → $7.99/mo · $83.88/yr — full admissions toolkit
 *   max  → $15/mo · $156/yr — Pro + priority AI, advanced analytics, premium tools
 */
export function getPricingTiers(locale: "en" | "ru"): PricingTier[] {
  const ru = locale === "ru";
  return [
    {
      id: "free",
      name: ru ? "Бесплатно" : "Free",
      price: { monthly: 0, yearly: 0 },
      tagline: ru ? "Изучайте вузы и планируйте — бесплатно навсегда." : "Explore universities and plan — free forever.",
      cta: ru ? "Начать бесплатно" : "Get started free",
      features: ru
        ? ["Поиск университетов", "Обзор университетов", "Сохранение вузов", "Базовая панель", "Базовая оценка шансов", "ИИ-наставник (3 в день)"]
        : ["University search", "University explorer", "Save universities", "Basic dashboard", "Basic chance assessment", "AI Mentor (3 / day)"],
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 7.99, yearly: 83.88 },
      tagline: ru ? "Всё необходимое, чтобы подавать заявки уверенно." : "Everything you need to apply with confidence.",
      highlight: true,
      cta: ru ? "Выбрать Pro" : "Choose Pro",
      features: ru
        ? ["Безлимитный ИИ-наставник", "Безлимитная оценка шансов", "Персональный план поступления", "Дедлайны и планировщик", "Поиск стипендий", "Трекер заявок"]
        : ["Unlimited AI Mentor", "Unlimited chance assessment", "Personalized roadmap", "Deadline tracking", "Scholarship finder", "Application tracking"],
    },
    {
      id: "max",
      name: "Max",
      price: { monthly: 15, yearly: 156 },
      tagline: ru ? "Максимум возможностей для поступления." : "Maximum power for your admissions.",
      cta: ru ? "Выбрать Max" : "Choose Max",
      features: ru
        ? ["Всё из Pro", "Приоритетный ИИ", "Расширенная аналитика", "Премиум-инструменты поступления", "Ранний доступ к новым функциям"]
        : ["Everything in Pro", "Priority AI", "Advanced analytics", "Premium admissions tools", "Early access to new features"],
    },
  ];
}

export const trustBadges = ["SOC 2 Type II", "FERPA aligned", "GDPR ready", "256-bit encryption"];
