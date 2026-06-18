import type { PricingTier } from "@/lib/types";

export const heroStats = [
  { label: "Students guided", value: 128000, suffix: "+" },
  { label: "Acceptance rate uplift", value: 3.2, suffix: "×" },
  { label: "Partner universities", value: 1400, suffix: "+" },
  { label: "Scholarships unlocked", value: 92, suffix: "M", prefix: "$" },
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
  {
    icon: "MessageSquare",
    title: "Personal admissions mentor",
    description: "Guidance on every program, deadline and essay — informed by what admissions committees actually reward.",
    accent: "from-brand-blue/20 to-brand-indigo/5",
  },
  {
    icon: "Target",
    title: "Honest chance assessment",
    description: "A calibrated read on every university — safe, target or reach — based on your real academics, not guesswork.",
    accent: "from-brand-indigo/20 to-brand-blue/5",
  },
  {
    icon: "Map",
    title: "Month-by-month plan",
    description: "A clear application timeline with milestones, tasks and exam dates tailored to your target intake.",
    accent: "from-brand-blue/20 to-brand-indigo/5",
  },
  {
    icon: "Building2",
    title: "University shortlist",
    description: "A balanced list across 1,400+ universities with fit, tuition, scholarships and live deadlines.",
    accent: "from-brand-indigo/20 to-brand-blue/5",
  },
  {
    icon: "FileText",
    title: "Essay review",
    description: "Paragraph-level feedback on tone, structure and impact — the way an admissions reader would assess it.",
    accent: "from-brand-blue/20 to-brand-indigo/5",
  },
  {
    icon: "CalendarClock",
    title: "Deadline tracking",
    description: "Every round, scholarship and document tracked in one place, with timely reminders so nothing slips.",
    accent: "from-brand-indigo/20 to-brand-blue/5",
  },
];

export const testimonials = [
  {
    quote:
      "AdmitFlow's admission estimator told me exactly where I stood. I rebuilt my list and got into ETH Zürich with a scholarship I didn't know existed.",
    name: "Maya Rashidova",
    role: "Admitted · ETH Zürich '27",
    avatar: "MR",
    accent: "from-brand-blue to-brand-cyan",
  },
  {
    quote:
      "The AI mentor felt like having a private counselor at 2am. It outlined my Common App essay and the feedback was sharper than my school's advisor.",
    name: "Daniel Okafor",
    role: "Admitted · MIT '27",
    avatar: "DO",
    accent: "from-brand-violet to-brand-pink",
  },
  {
    quote:
      "I was overwhelmed by deadlines across 9 schools. The roadmap broke everything into weekly tasks. I submitted every application early.",
    name: "Sofia Bianchi",
    role: "Admitted · Oxford '27",
    avatar: "SB",
    accent: "from-brand-indigo to-brand-violet",
  },
  {
    quote:
      "As a first-gen student abroad, I had no one to ask. AdmitFlow's roadmap and scholarship finder genuinely changed my life trajectory.",
    name: "Arjun Mehta",
    role: "Admitted · NUS '27",
    avatar: "AM",
    accent: "from-brand-cyan to-brand-blue",
  },
  {
    quote:
      "The fit scores were uncannily accurate. I trusted the platform with my reach list and landed two acceptances out of three.",
    name: "Lina Hofmann",
    role: "Admitted · TUM '27",
    avatar: "LH",
    accent: "from-brand-pink to-brand-violet",
  },
  {
    quote:
      "It's the only tool that felt built for international students. Currency, visas, scholarships — everything was in one place.",
    name: "Chen Wei",
    role: "Admitted · Toronto '27",
    avatar: "CW",
    accent: "from-brand-blue to-brand-indigo",
  },
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
    a: "Plans start at $19/month for Starter, which includes your personalized roadmap, deadline tracker, profile analysis and 50 mentor messages. Pro ($49/mo) unlocks unlimited mentoring, the chance assessment and essay review, and Premium Mentor ($149/mo) adds a dedicated human counselor.",
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
    a: "Тарифы начинаются с $19/мес (Starter): персональный план, трекер дедлайнов, анализ профиля и 50 сообщений наставнику. Pro ($49/мес) открывает безлимитное наставничество, оценку шансов и проверку эссе, а Premium Mentor ($149/мес) добавляет персонального консультанта-человека.",
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
 *   free      → start free (no checkout)
 *   premium   → includes a 7-day free trial, then paid; the main plan
 *   concierge → AI + a dedicated human admissions expert (contact sales)
 */
export function getPricingTiers(locale: "en" | "ru"): PricingTier[] {
  const ru = locale === "ru";
  return [
    {
      id: "free",
      name: ru ? "Бесплатно" : "Free",
      price: { monthly: 0, yearly: 0 },
      tagline: ru ? "Изучайте вузы и составляйте список — бесплатно навсегда." : "Explore universities and build your shortlist — free forever.",
      cta: ru ? "Начать бесплатно" : "Get started free",
      features: ru
        ? ["Поиск и обзор университетов", "Сохранение вузов и шорт-лист", "Базовый профиль и балл поступления", "Ограниченная оценка шансов", "5 сообщений ментору в день"]
        : ["University search & explorer", "Save universities & shortlist", "Basic profile & admission score", "Limited chance assessment", "5 AI mentor messages / day"],
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 19, yearly: 15 },
      tagline: ru ? "Всё без ограничений. Начните с 7-дневного бесплатного периода." : "Everything, unlimited. Starts with a 7-day free trial.",
      highlight: true,
      badge: ru ? "7 дней бесплатно" : "7-day free trial",
      cta: ru ? "Начать пробный период" : "Start your free trial",
      features: ru
        ? ["Безлимитный AI-ментор", "Безлимитная оценка шансов", "Проверка эссе с AI", "Поиск стипендий и уведомления", "Персональный роадмап", "Дедлайны и планировщик", "Полная база программ"]
        : ["Unlimited AI Mentor", "Unlimited chance assessments", "Essay review & AI feedback", "Scholarship finder & alerts", "Personalized roadmap", "Deadline tracking & planner", "Full program database"],
    },
    {
      id: "concierge",
      name: ru ? "Консьерж" : "Concierge",
      price: { monthly: 149, yearly: 119 },
      tagline: ru ? "AI плюс персональный эксперт по поступлению." : "AI plus a dedicated human admissions expert.",
      cta: ru ? "Связаться с приёмной" : "Talk to admissions",
      features: ru
        ? ["Всё из Premium", "Личный консультант 1:1", "Проверка заявки перед подачей", "Глубокая проверка эссе", "Подготовка к интервью", "Помощь с визой и переездом"]
        : ["Everything in Premium", "1:1 human counselor", "Application review before submission", "Hands-on essay review", "Interview preparation", "Visa & relocation guidance"],
    },
  ];
}

export const trustBadges = ["SOC 2 Type II", "FERPA aligned", "GDPR ready", "256-bit encryption"];
