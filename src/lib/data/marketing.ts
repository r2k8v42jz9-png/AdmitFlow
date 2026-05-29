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
    icon: "Sparkles",
    title: "AI Admission Mentor",
    description: "A 24/7 mentor that knows every program, deadline and essay rubric — trained on 2M+ admitted profiles.",
    accent: "from-brand-blue/30 to-brand-cyan/10",
  },
  {
    icon: "Target",
    title: "Admission Chance Estimator",
    description: "Get a calibrated probability for every university based on your real profile — not guesswork.",
    accent: "from-brand-violet/30 to-brand-pink/10",
  },
  {
    icon: "Map",
    title: "Personalized Roadmap",
    description: "A month-by-month plan with milestones, tasks and exam schedules tailored to your target intake.",
    accent: "from-brand-indigo/30 to-brand-blue/10",
  },
  {
    icon: "Building2",
    title: "University Explorer",
    description: "Search 1,400+ universities with AI fit scores, tuition, scholarships and live deadline tracking.",
    accent: "from-brand-cyan/30 to-brand-blue/10",
  },
  {
    icon: "FileText",
    title: "Essay Feedback Engine",
    description: "Paragraph-level feedback on tone, structure and impact — modeled on what admissions readers reward.",
    accent: "from-brand-pink/30 to-brand-violet/10",
  },
  {
    icon: "CalendarClock",
    title: "Deadline Autopilot",
    description: "Never miss a date. We track every round, scholarship and document with smart reminders.",
    accent: "from-brand-blue/30 to-brand-indigo/10",
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
    q: "How accurate is the admission chance estimator?",
    a: "Our model is trained on millions of anonymized admitted and rejected profiles, then calibrated against published acceptance rates. It produces a probability range, not a guarantee — but students using it report list decisions that are 3.2× more likely to convert to offers.",
  },
  {
    q: "Is AdmitFlow only for US universities?",
    a: "No. We cover 1,400+ universities across the US, UK, Canada, Europe, Asia and Australia — with country-specific deadlines, tuition in local currency, visa notes and scholarship databases.",
  },
  {
    q: "Will the AI write my essays for me?",
    a: "AdmitFlow never ghost-writes. The essay engine gives structural feedback, brainstorming prompts and paragraph-level suggestions so your authentic voice comes through — the way admissions readers want it.",
  },
  {
    q: "How much does AdmitFlow cost?",
    a: "Plans start at $19/month for Starter, which includes your personalized roadmap, deadline tracker, profile analysis and 50 AI mentor messages. Pro ($49/mo) unlocks unlimited AI, the admission estimator and essay feedback, and Premium Mentor ($149/mo) adds a dedicated human counselor.",
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

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 19, yearly: 15 },
    tagline: "Everything you need to start applying with a real plan.",
    cta: "Start with Starter",
    features: [
      "50 AI mentor messages / month",
      "20 university recommendations",
      "Basic personalized roadmap",
      "Deadline tracker",
      "Profile analysis & admission score",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 49, yearly: 39 },
    tagline: "Unlimited AI and the full toolkit to apply with confidence.",
    highlight: true,
    badge: "Most popular",
    cta: "Upgrade to Pro",
    features: [
      "Unlimited AI mentor chat",
      "Full university database",
      "Admission chance estimator",
      "Essay feedback engine",
      "Scholarship finder & alerts",
      "Advanced roadmap",
      "Application tracker",
    ],
  },
  {
    id: "premium",
    name: "Premium Mentor",
    price: { monthly: 149, yearly: 119 },
    tagline: "AI plus a dedicated human admissions expert in your corner.",
    cta: "Talk to admissions",
    features: [
      "Everything in Pro",
      "1:1 human counselor support",
      "Application review before submission",
      "Hands-on essay review",
      "Priority AI responses",
      "Interview preparation",
      "Visa & relocation guidance",
    ],
  },
];

export const trustBadges = ["SOC 2 Type II", "FERPA aligned", "GDPR ready", "256-bit encryption"];
