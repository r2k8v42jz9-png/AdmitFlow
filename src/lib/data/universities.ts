import type { University, Program, Scholarship } from "@/lib/types";

/**
 * Hand-authored, fully detailed flagship universities.
 * Additional schools (see `rawUniversities` below) are expanded from compact
 * records by `makeUniversity()` so the catalog scales to thousands of entries
 * without repeating boilerplate.
 */
const featured: University[] = [
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    country: "United States",
    city: "Cambridge, MA",
    flag: "🇺🇸",
    logoColor: "#A31F34",
    rankWorld: 1,
    rankNational: 1,
    acceptanceRate: 4,
    tuitionPerYear: 59750,
    currency: "USD",
    livingCost: 22000,
    studentCount: 11920,
    intlPercent: 33,
    fitScore: 82,
    admissionProbability: 31,
    tags: ["Engineering", "Computer Science", "Research", "STEM"],
    requirements: { gpa: 3.9, ielts: 7.5, sat: 1540, essays: 5, recommendations: 2 },
    deadlines: [
      { round: "Early Action", date: "2026-11-01" },
      { round: "Regular Decision", date: "2027-01-05" },
    ],
    programs: [
      { name: "Computer Science & Engineering", degree: "Bachelor", duration: "4 years", tuitionPerYear: 59750 },
      { name: "Artificial Intelligence", degree: "Master", duration: "2 years", tuitionPerYear: 61990 },
      { name: "Mechanical Engineering", degree: "Bachelor", duration: "4 years", tuitionPerYear: 59750 },
    ],
    scholarships: [
      { name: "MIT Need-Based Aid", amount: "Up to full tuition", coverage: "Tuition + living", deadline: "2026-11-15" },
      { name: "International Merit Grant", amount: "$25,000/yr", coverage: "Partial tuition", deadline: "2026-12-01" },
    ],
    highlights: ["#1 for engineering worldwide", "Median starting salary $112k", "Vibrant startup ecosystem"],
    aiInsight:
      "Your robotics olympiad medal and 1520 SAT make you competitive, but a stronger math essay and a second STEM recommendation would meaningfully lift your odds. Target Early Action.",
    blurb: "The global benchmark for science, technology and entrepreneurship.",
    accent: "from-rose-500/25 to-orange-500/10",
  },
  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford",
    country: "United States",
    city: "Stanford, CA",
    flag: "🇺🇸",
    logoColor: "#8C1515",
    rankWorld: 3,
    rankNational: 2,
    acceptanceRate: 3.7,
    tuitionPerYear: 61730,
    currency: "USD",
    livingCost: 24500,
    studentCount: 17680,
    intlPercent: 24,
    fitScore: 78,
    admissionProbability: 24,
    tags: ["Computer Science", "Business", "Innovation", "STEM"],
    requirements: { gpa: 3.95, ielts: 7.5, sat: 1550, essays: 6, recommendations: 3 },
    deadlines: [
      { round: "Restrictive Early Action", date: "2026-11-01" },
      { round: "Regular Decision", date: "2027-01-05" },
    ],
    programs: [
      { name: "Computer Science", degree: "Bachelor", duration: "4 years", tuitionPerYear: 61730 },
      { name: "Symbolic Systems", degree: "Bachelor", duration: "4 years", tuitionPerYear: 61730 },
      { name: "MBA", degree: "Master", duration: "2 years", tuitionPerYear: 79860 },
    ],
    scholarships: [
      { name: "Knight-Hennessy Scholars", amount: "Full funding", coverage: "Tuition + stipend", deadline: "2026-10-10" },
      { name: "Stanford Financial Aid", amount: "Up to full tuition", coverage: "Need-based", deadline: "2026-11-15" },
    ],
    highlights: ["Heart of Silicon Valley", "Top 3 CS program globally", "Unmatched alumni network"],
    aiInsight:
      "Stanford weighs intellectual vitality heavily. Your AI side-project is a great hook — frame it around impact and curiosity in your essays rather than just technical depth.",
    blurb: "Where Silicon Valley's boldest ideas are born.",
    accent: "from-red-500/25 to-amber-500/10",
  },
  {
    id: "oxford",
    name: "University of Oxford",
    shortName: "Oxford",
    country: "United Kingdom",
    city: "Oxford, England",
    flag: "🇬🇧",
    logoColor: "#002147",
    rankWorld: 2,
    rankNational: 1,
    acceptanceRate: 17,
    tuitionPerYear: 48620,
    currency: "GBP",
    livingCost: 17500,
    studentCount: 26000,
    intlPercent: 45,
    fitScore: 88,
    admissionProbability: 47,
    tags: ["Liberal Arts", "Research", "Humanities", "STEM"],
    requirements: { gpa: 3.8, ielts: 7.0, essays: 1, recommendations: 1 },
    deadlines: [{ round: "UCAS Deadline", date: "2026-10-15" }],
    programs: [
      { name: "Computer Science", degree: "Bachelor", duration: "3 years", tuitionPerYear: 48620 },
      { name: "PPE (Philosophy, Politics & Economics)", degree: "Bachelor", duration: "3 years", tuitionPerYear: 39010 },
      { name: "MSc Advanced Computer Science", degree: "Master", duration: "1 year", tuitionPerYear: 41000 },
    ],
    scholarships: [
      { name: "Reach Oxford Scholarship", amount: "Full cost", coverage: "Tuition + living + travel", deadline: "2026-09-30" },
      { name: "Clarendon Fund", amount: "Full funding", coverage: "Graduate students", deadline: "2026-12-01" },
    ],
    highlights: ["Tutorial-based teaching", "Oldest university in the English-speaking world", "Rhodes Scholar pipeline"],
    aiInsight:
      "Oxford admissions are subject-specific and interview-heavy. Your strong academics fit well — begin admissions-test prep (MAT/TSA) now and practise structured verbal reasoning.",
    blurb: "Eight centuries of academic excellence and tradition.",
    accent: "from-blue-600/25 to-indigo-500/10",
  },
  {
    id: "cambridge",
    name: "University of Cambridge",
    shortName: "Cambridge",
    country: "United Kingdom",
    city: "Cambridge, England",
    flag: "🇬🇧",
    logoColor: "#A3C1AD",
    rankWorld: 5,
    rankNational: 2,
    acceptanceRate: 21,
    tuitionPerYear: 46000,
    currency: "GBP",
    livingCost: 16800,
    studentCount: 24450,
    intlPercent: 38,
    fitScore: 85,
    admissionProbability: 44,
    tags: ["Research", "STEM", "Mathematics", "Sciences"],
    requirements: { gpa: 3.85, ielts: 7.5, essays: 1, recommendations: 1 },
    deadlines: [{ round: "UCAS Deadline", date: "2026-10-15" }],
    programs: [
      { name: "Engineering", degree: "Bachelor", duration: "4 years", tuitionPerYear: 46000 },
      { name: "Natural Sciences", degree: "Bachelor", duration: "3 years", tuitionPerYear: 42000 },
      { name: "MPhil Machine Learning", degree: "Master", duration: "1 year", tuitionPerYear: 44000 },
    ],
    scholarships: [
      { name: "Gates Cambridge", amount: "Full funding", coverage: "Tuition + stipend", deadline: "2026-10-12" },
      { name: "Cambridge Trust Scholarship", amount: "Partial–full", coverage: "Need + merit", deadline: "2026-12-01" },
    ],
    highlights: ["98 Nobel laureates", "Collegiate system", "Supervisions with world experts"],
    aiInsight:
      "Cambridge values demonstrable subject passion. Reference super-curricular reading in your personal statement and prepare thoroughly for the subject interview.",
    blurb: "A collegiate powerhouse of discovery and rigour.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "eth",
    name: "ETH Zürich",
    shortName: "ETH Zürich",
    country: "Switzerland",
    city: "Zürich",
    flag: "🇨🇭",
    logoColor: "#1F407A",
    rankWorld: 7,
    rankNational: 1,
    acceptanceRate: 27,
    tuitionPerYear: 1460,
    currency: "CHF",
    livingCost: 26000,
    studentCount: 23900,
    intlPercent: 41,
    fitScore: 91,
    admissionProbability: 58,
    tags: ["Engineering", "STEM", "Affordable", "Research"],
    requirements: { gpa: 3.7, ielts: 7.0, essays: 1, recommendations: 2 },
    deadlines: [{ round: "Application Deadline", date: "2026-12-15" }],
    programs: [
      { name: "Computer Science", degree: "Master", duration: "2 years", tuitionPerYear: 1460 },
      { name: "Robotics, Systems & Control", degree: "Master", duration: "2 years", tuitionPerYear: 1460 },
      { name: "Data Science", degree: "Master", duration: "2 years", tuitionPerYear: 1460 },
    ],
    scholarships: [
      { name: "ESOP Excellence Scholarship", amount: "CHF 12,000/sem", coverage: "Living + tuition", deadline: "2026-12-15" },
      { name: "Master Scholarship Programme", amount: "Full living", coverage: "Merit-based", deadline: "2026-12-15" },
    ],
    highlights: ["Tuition under $2k/yr", "Einstein's alma mater", "Best value in Europe"],
    aiInsight:
      "An exceptional value pick and a likely match for your profile. Your math grades are the key lever here — highlight any analysis or linear-algebra coursework.",
    blurb: "World-class engineering at an unbeatable price.",
    accent: "from-sky-500/25 to-blue-500/10",
  },
  {
    id: "nus",
    name: "National University of Singapore",
    shortName: "NUS",
    country: "Singapore",
    city: "Singapore",
    flag: "🇸🇬",
    logoColor: "#EF7C00",
    rankWorld: 8,
    rankNational: 1,
    acceptanceRate: 12,
    tuitionPerYear: 29850,
    currency: "SGD",
    livingCost: 14500,
    studentCount: 38600,
    intlPercent: 30,
    fitScore: 86,
    admissionProbability: 52,
    tags: ["STEM", "Business", "Asia", "Innovation"],
    requirements: { gpa: 3.7, ielts: 6.5, sat: 1450, essays: 2, recommendations: 2 },
    deadlines: [{ round: "International Round", date: "2027-02-28" }],
    programs: [
      { name: "Computer Science", degree: "Bachelor", duration: "4 years", tuitionPerYear: 29850 },
      { name: "Business Analytics", degree: "Bachelor", duration: "4 years", tuitionPerYear: 31000 },
      { name: "Quantitative Finance", degree: "Master", duration: "1.5 years", tuitionPerYear: 48000 },
    ],
    scholarships: [
      { name: "ASEAN Undergraduate Scholarship", amount: "Full tuition", coverage: "Tuition + allowance", deadline: "2027-03-19" },
      { name: "Science & Technology Scholarship", amount: "Full tuition", coverage: "Merit", deadline: "2027-02-28" },
    ],
    highlights: ["#1 in Asia", "Strong industry ties", "Global exchange network"],
    aiInsight:
      "NUS is a strong target with generous scholarships for international students. Your extracurricular leadership maps well to their holistic review.",
    blurb: "Asia's leading university and innovation hub.",
    accent: "from-orange-500/25 to-amber-500/10",
  },
  {
    id: "toronto",
    name: "University of Toronto",
    shortName: "U of T",
    country: "Canada",
    city: "Toronto, ON",
    flag: "🇨🇦",
    logoColor: "#1E3765",
    rankWorld: 21,
    rankNational: 1,
    acceptanceRate: 43,
    tuitionPerYear: 45900,
    currency: "CAD",
    livingCost: 15500,
    studentCount: 97000,
    intlPercent: 28,
    fitScore: 89,
    admissionProbability: 71,
    tags: ["Research", "STEM", "Diverse", "AI"],
    requirements: { gpa: 3.6, ielts: 6.5, essays: 2, recommendations: 1 },
    deadlines: [{ round: "International Deadline", date: "2027-01-15" }],
    programs: [
      { name: "Computer Science (PEY)", degree: "Bachelor", duration: "4 years", tuitionPerYear: 45900 },
      { name: "Engineering Science", degree: "Bachelor", duration: "4 years", tuitionPerYear: 62000 },
      { name: "MScAC Applied Computing", degree: "Master", duration: "1.5 years", tuitionPerYear: 38000 },
    ],
    scholarships: [
      { name: "Lester B. Pearson Scholarship", amount: "Full ride", coverage: "Tuition + books + living", deadline: "2026-11-30" },
      { name: "International Scholar Award", amount: "CAD 10,000", coverage: "Partial", deadline: "2027-01-15" },
    ],
    highlights: ["Birthplace of deep learning", "Paid co-op (PEY)", "Welcoming to internationals"],
    aiInsight:
      "A high-probability target with the prestigious Pearson scholarship as an upside. Apply early — competitive programs fill before the final deadline.",
    blurb: "Canada's research giant and the cradle of modern AI.",
    accent: "from-indigo-500/25 to-blue-500/10",
  },
  {
    id: "tum",
    name: "Technical University of Munich",
    shortName: "TUM",
    country: "Germany",
    city: "Munich",
    flag: "🇩🇪",
    logoColor: "#3070B3",
    rankWorld: 28,
    rankNational: 1,
    acceptanceRate: 8,
    tuitionPerYear: 0,
    currency: "EUR",
    livingCost: 12500,
    studentCount: 52000,
    intlPercent: 42,
    fitScore: 90,
    admissionProbability: 63,
    tags: ["Engineering", "Tuition-Free", "STEM", "Research"],
    requirements: { gpa: 3.5, ielts: 6.5, essays: 1, recommendations: 1 },
    deadlines: [{ round: "Winter Semester", date: "2027-01-15" }],
    programs: [
      { name: "Informatics", degree: "Bachelor", duration: "3 years", tuitionPerYear: 0 },
      { name: "Robotics, Cognition, Intelligence", degree: "Master", duration: "2 years", tuitionPerYear: 0 },
      { name: "Management & Technology", degree: "Bachelor", duration: "3 years", tuitionPerYear: 0 },
    ],
    scholarships: [
      { name: "Deutschlandstipendium", amount: "€300/month", coverage: "Living stipend", deadline: "2026-10-31" },
      { name: "DAAD Scholarship", amount: "€934/month", coverage: "Full living", deadline: "2026-11-30" },
    ],
    highlights: ["No tuition fees", "Industry capital of Europe", "BMW, Siemens partnerships"],
    aiInsight:
      "Tuition-free with elite engineering — superb ROI. Your German language progress will be a differentiator; even B1 strengthens the application.",
    blurb: "Germany's top technical university — and tuition-free.",
    accent: "from-blue-500/25 to-cyan-500/10",
  },
  {
    id: "ucl",
    name: "University College London",
    shortName: "UCL",
    country: "United Kingdom",
    city: "London, England",
    flag: "🇬🇧",
    logoColor: "#500778",
    rankWorld: 9,
    rankNational: 4,
    acceptanceRate: 30,
    tuitionPerYear: 38000,
    currency: "GBP",
    livingCost: 19500,
    studentCount: 46830,
    intlPercent: 53,
    fitScore: 83,
    admissionProbability: 66,
    tags: ["Research", "Urban", "Diverse", "STEM"],
    requirements: { gpa: 3.6, ielts: 6.5, essays: 1, recommendations: 1 },
    deadlines: [{ round: "UCAS Deadline", date: "2027-01-29" }],
    programs: [
      { name: "Computer Science", degree: "Bachelor", duration: "3 years", tuitionPerYear: 38000 },
      { name: "MSc Machine Learning", degree: "Master", duration: "1 year", tuitionPerYear: 41000 },
      { name: "Economics", degree: "Bachelor", duration: "3 years", tuitionPerYear: 32000 },
    ],
    scholarships: [
      { name: "UCL Global Undergraduate Scholarship", amount: "£15,000/yr", coverage: "Need-based", deadline: "2027-04-04" },
      { name: "Denys Holland Scholarship", amount: "£9,000/yr", coverage: "Partial", deadline: "2027-05-31" },
    ],
    highlights: ["Heart of central London", "Most international UK university", "Strong AI research (DeepMind links)"],
    aiInsight:
      "A balanced target with strong odds. London living costs are high — pair the application with the Global Undergraduate Scholarship to stay within budget.",
    blurb: "London's global university at the centre of it all.",
    accent: "from-purple-500/25 to-fuchsia-500/10",
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    shortName: "Melbourne",
    country: "Australia",
    city: "Melbourne, VIC",
    flag: "🇦🇺",
    logoColor: "#000F46",
    rankWorld: 13,
    rankNational: 1,
    acceptanceRate: 38,
    tuitionPerYear: 45000,
    currency: "AUD",
    livingCost: 21000,
    studentCount: 52000,
    intlPercent: 47,
    fitScore: 80,
    admissionProbability: 69,
    tags: ["Research", "Lifestyle", "STEM", "Business"],
    requirements: { gpa: 3.5, ielts: 6.5, essays: 1, recommendations: 1 },
    deadlines: [{ round: "Semester 1 Intake", date: "2026-10-31" }],
    programs: [
      { name: "Bachelor of Science (Computing)", degree: "Bachelor", duration: "3 years", tuitionPerYear: 45000 },
      { name: "Master of Data Science", degree: "Master", duration: "2 years", tuitionPerYear: 48000 },
      { name: "Bachelor of Commerce", degree: "Bachelor", duration: "3 years", tuitionPerYear: 47000 },
    ],
    scholarships: [
      { name: "Melbourne International Undergraduate", amount: "Up to 100% tuition", coverage: "Merit", deadline: "2026-10-31" },
      { name: "Graduate Research Scholarship", amount: "Full + stipend", coverage: "Research", deadline: "2026-10-31" },
    ],
    highlights: ["#1 in Australia", "World's most liveable city", "Post-study work visa pathway"],
    aiInsight:
      "Comfortable admit territory. The automatic merit scholarship means your strong GPA could cut tuition significantly with no extra essay.",
    blurb: "Australia's #1 university in its most liveable city.",
    accent: "from-blue-700/25 to-sky-500/10",
  },
  {
    id: "tsinghua",
    name: "Tsinghua University",
    shortName: "Tsinghua",
    country: "China",
    city: "Beijing",
    flag: "🇨🇳",
    logoColor: "#660874",
    rankWorld: 12,
    rankNational: 1,
    acceptanceRate: 15,
    tuitionPerYear: 40000,
    currency: "CNY",
    livingCost: 9000,
    studentCount: 50000,
    intlPercent: 11,
    fitScore: 74,
    admissionProbability: 41,
    tags: ["STEM", "Research", "Asia", "Engineering"],
    requirements: { gpa: 3.7, ielts: 6.5, essays: 2, recommendations: 2 },
    deadlines: [{ round: "International Students", date: "2026-12-31" }],
    programs: [
      { name: "Computer Science & Technology", degree: "Bachelor", duration: "4 years", tuitionPerYear: 40000 },
      { name: "Schwarzman Scholars", degree: "Master", duration: "1 year", tuitionPerYear: 0 },
      { name: "Data Science & Information Tech", degree: "Master", duration: "2 years", tuitionPerYear: 45000 },
    ],
    scholarships: [
      { name: "Chinese Government Scholarship", amount: "Full + stipend", coverage: "Tuition + living", deadline: "2026-12-31" },
      { name: "Schwarzman Scholarship", amount: "Full funding", coverage: "All costs", deadline: "2026-09-26" },
    ],
    highlights: ["Asia's top engineering school", "Schwarzman Scholars program", "Massive research funding"],
    aiInsight:
      "Consider the fully-funded Schwarzman track if leadership is your strength. Standard admission favours top quantitative scores.",
    blurb: "China's premier engineering and research institution.",
    accent: "from-fuchsia-600/25 to-purple-500/10",
  },
  {
    id: "epfl",
    name: "EPFL",
    shortName: "EPFL",
    country: "Switzerland",
    city: "Lausanne",
    flag: "🇨🇭",
    logoColor: "#FF0000",
    rankWorld: 14,
    rankNational: 2,
    acceptanceRate: 30,
    tuitionPerYear: 1530,
    currency: "CHF",
    livingCost: 24000,
    studentCount: 12500,
    intlPercent: 55,
    fitScore: 87,
    admissionProbability: 60,
    tags: ["Engineering", "Affordable", "STEM", "Research"],
    requirements: { gpa: 3.6, ielts: 7.0, essays: 1, recommendations: 2 },
    deadlines: [{ round: "Application Deadline", date: "2026-12-15" }],
    programs: [
      { name: "Computer Science", degree: "Master", duration: "2 years", tuitionPerYear: 1530 },
      { name: "Robotics", degree: "Master", duration: "2 years", tuitionPerYear: 1530 },
      { name: "Communication Systems", degree: "Bachelor", duration: "3 years", tuitionPerYear: 1530 },
    ],
    scholarships: [
      { name: "EPFL Excellence Fellowship", amount: "CHF 16,000/yr", coverage: "Living", deadline: "2026-12-15" },
      { name: "Master's Excellence Scholarship", amount: "CHF 32,000 total", coverage: "Merit", deadline: "2026-12-15" },
    ],
    highlights: ["Lake Geneva campus", "Tuition under $2k/yr", "Top robotics research"],
    aiInsight:
      "Another excellent-value Swiss option. EPFL is highly quantitative — your physics and math performance will carry the most weight.",
    blurb: "Switzerland's innovation-driven engineering school.",
    accent: "from-red-500/25 to-rose-500/10",
  },
];

/* ------------------------------------------------------------------ */
/*  Scalable expansion layer                                           */
/*  Compact records → full University objects via makeUniversity().    */
/*  Adding a school needs ~12 core fields; display fields are derived. */
/* ------------------------------------------------------------------ */

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  "United Kingdom": "🇬🇧",
  Germany: "🇩🇪",
  Switzerland: "🇨🇭",
  France: "🇫🇷",
  Netherlands: "🇳🇱",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Norway: "🇳🇴",
  Finland: "🇫🇮",
  Denmark: "🇩🇰",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  Singapore: "🇸🇬",
  Japan: "🇯🇵",
  "South Korea": "🇰🇷",
  China: "🇨🇳",
  "United Arab Emirates": "🇦🇪",
  Turkey: "🇹🇷",
  Malaysia: "🇲🇾",
  Uzbekistan: "🇺🇿",
  Kazakhstan: "🇰🇿",
  Russia: "🇷🇺",
};

const ACCENTS = [
  "from-blue-500/25 to-indigo-500/10",
  "from-indigo-500/25 to-blue-500/10",
  "from-sky-500/25 to-blue-500/10",
  "from-blue-600/25 to-cyan-500/10",
  "from-slate-500/25 to-blue-500/10",
];
const LOGO_COLORS = ["#1d4ed8", "#4338ca", "#0ea5e9", "#0369a1", "#3730a3"];

function hashId(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function clampN(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export interface RawUniversity {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  rankWorld: number;
  rankNational: number;
  acceptanceRate: number;
  tuitionPerYear: number;
  currency: string;
  tags: string[];
  gpa: number;
  ielts: number;
  sat?: number;
  website: string;
  blurb: string;
  livingCost?: number;
  studentCount?: number;
  intlPercent?: number;
  programs?: string[];
  scholarships?: { name: string; amount: string }[];
  deadlines?: { round: string; date: string }[];
}

function makeUniversity(r: RawUniversity): University {
  const h = hashId(r.id);
  const intlPercent = r.intlPercent ?? 12 + (h % 28);
  const studentCount = r.studentCount ?? 10000 + (h % 32000);
  const livingCost = r.livingCost ?? (r.tuitionPerYear > 0 ? Math.round(r.tuitionPerYear * 0.5) + 6000 : 12000);

  const fitScore = clampN(94 - Math.round(r.rankWorld / 18) + (h % 7), 58, 96);
  const admissionProbability = clampN(Math.round(r.acceptanceRate * 1.3) + (h % 6), 6, 92);

  const programs: Program[] = (r.programs ?? r.tags.slice(0, 3)).map((name, i) => ({
    name,
    degree: (i === 0 ? "Bachelor" : i === 1 ? "Master" : "PhD") as Program["degree"],
    duration: i === 0 ? "3–4 years" : i === 1 ? "1–2 years" : "3–5 years",
    tuitionPerYear: r.tuitionPerYear,
  }));

  const scholarships: Scholarship[] = (
    r.scholarships ?? [{ name: `${r.shortName} International Merit Award`, amount: "Partial tuition" }]
  ).map((s, i) => ({
    name: s.name,
    amount: s.amount,
    coverage: i === 0 ? "Partial tuition" : "Tuition support",
    deadline: "2026-12-15",
  }));

  const deadlines = r.deadlines ?? [
    { round: "Early Round", date: "2026-11-15" },
    { round: "Regular Round", date: "2027-02-01" },
  ];

  return {
    id: r.id,
    name: r.name,
    shortName: r.shortName,
    country: r.country,
    city: r.city,
    flag: COUNTRY_FLAGS[r.country] ?? "🏳️",
    logoColor: LOGO_COLORS[h % LOGO_COLORS.length],
    rankWorld: r.rankWorld,
    rankNational: r.rankNational,
    acceptanceRate: r.acceptanceRate,
    tuitionPerYear: r.tuitionPerYear,
    currency: r.currency,
    livingCost,
    studentCount,
    intlPercent,
    fitScore,
    admissionProbability,
    tags: r.tags,
    requirements: { gpa: r.gpa, ielts: r.ielts, sat: r.sat, essays: 2, recommendations: 2 },
    deadlines,
    programs,
    scholarships,
    highlights: [
      `Ranked #${r.rankWorld} worldwide · #${r.rankNational} nationally`,
      `${intlPercent}% international students`,
      `${r.acceptanceRate}% acceptance rate`,
    ],
    aiInsight: `${r.shortName} rewards ${(r.tags[0] ?? "academic").toLowerCase()} strength. With a GPA near ${r.gpa.toFixed(1)} and IELTS ${r.ielts.toFixed(1)} you fit its profile — lead with your ${(r.tags[1] ?? r.tags[0] ?? "academic").toLowerCase()} experience in your application.`,
    blurb: r.blurb,
    accent: ACCENTS[h % ACCENTS.length],
    website: r.website,
  };
}

const rawUniversities: RawUniversity[] = [
  // United States
  { id: "harvard", name: "Harvard University", shortName: "Harvard", country: "United States", city: "Cambridge, MA", rankWorld: 4, rankNational: 3, acceptanceRate: 3.4, tuitionPerYear: 57000, currency: "USD", tags: ["Law", "Business", "Medicine", "Research"], gpa: 3.95, ielts: 7.5, sat: 1550, website: "https://harvard.edu", blurb: "The world's most renowned university across law, medicine and business." },
  { id: "berkeley", name: "University of California, Berkeley", shortName: "UC Berkeley", country: "United States", city: "Berkeley, CA", rankWorld: 10, rankNational: 4, acceptanceRate: 11, tuitionPerYear: 44000, currency: "USD", tags: ["Computer Science", "Engineering", "Public", "STEM"], gpa: 3.85, ielts: 7, sat: 1480, website: "https://berkeley.edu", blurb: "A public powerhouse for engineering and computer science." },
  // Canada
  { id: "ubc", name: "University of British Columbia", shortName: "UBC", country: "Canada", city: "Vancouver", rankWorld: 34, rankNational: 2, acceptanceRate: 52, tuitionPerYear: 42000, currency: "CAD", tags: ["Research", "Sustainability", "Computer Science"], gpa: 3.6, ielts: 6.5, sat: 1350, website: "https://ubc.ca", blurb: "A global research university on Canada's Pacific coast." },
  { id: "mcgill", name: "McGill University", shortName: "McGill", country: "Canada", city: "Montreal", rankWorld: 30, rankNational: 1, acceptanceRate: 46, tuitionPerYear: 45000, currency: "CAD", tags: ["Medicine", "Research", "Business"], gpa: 3.7, ielts: 6.5, website: "https://mcgill.ca", blurb: "Canada's most internationally diverse research university." },
  // United Kingdom
  { id: "imperial", name: "Imperial College London", shortName: "Imperial", country: "United Kingdom", city: "London", rankWorld: 6, rankNational: 3, acceptanceRate: 14, tuitionPerYear: 38000, currency: "GBP", tags: ["Engineering", "Medicine", "STEM", "Research"], gpa: 3.9, ielts: 7, website: "https://imperial.ac.uk", blurb: "The UK's leading science, engineering and medicine institution." },
  { id: "edinburgh", name: "University of Edinburgh", shortName: "Edinburgh", country: "United Kingdom", city: "Edinburgh", rankWorld: 22, rankNational: 4, acceptanceRate: 40, tuitionPerYear: 34000, currency: "GBP", tags: ["AI", "Humanities", "Medicine", "Research"], gpa: 3.7, ielts: 6.5, website: "https://ed.ac.uk", blurb: "A historic research university and AI research leader." },
  // Germany
  { id: "lmu", name: "Ludwig Maximilian University of Munich", shortName: "LMU Munich", country: "Germany", city: "Munich", rankWorld: 59, rankNational: 2, acceptanceRate: 40, tuitionPerYear: 0, currency: "EUR", tags: ["Research", "Medicine", "Humanities"], gpa: 3.6, ielts: 6.5, website: "https://lmu.de", blurb: "One of Europe's oldest and tuition-free flagship universities." },
  { id: "heidelberg", name: "Heidelberg University", shortName: "Heidelberg", country: "Germany", city: "Heidelberg", rankWorld: 87, rankNational: 3, acceptanceRate: 45, tuitionPerYear: 1500, currency: "EUR", tags: ["Medicine", "Research", "Sciences"], gpa: 3.6, ielts: 6.5, website: "https://uni-heidelberg.de", blurb: "Germany's oldest university, renowned for research and medicine." },
  // France
  { id: "psl", name: "Université PSL", shortName: "PSL", country: "France", city: "Paris", rankWorld: 24, rankNational: 1, acceptanceRate: 22, tuitionPerYear: 3500, currency: "EUR", tags: ["Research", "Sciences", "Humanities"], gpa: 3.7, ielts: 6.5, website: "https://psl.eu", blurb: "Paris's collegiate research university spanning sciences and the arts." },
  { id: "polytechnique", name: "École Polytechnique", shortName: "Polytechnique", country: "France", city: "Palaiseau", rankWorld: 38, rankNational: 2, acceptanceRate: 20, tuitionPerYear: 15000, currency: "EUR", tags: ["Engineering", "Mathematics", "STEM"], gpa: 3.8, ielts: 7, website: "https://polytechnique.edu", blurb: "France's elite engineering grande école." },
  // Netherlands
  { id: "tudelft", name: "Delft University of Technology", shortName: "TU Delft", country: "Netherlands", city: "Delft", rankWorld: 47, rankNational: 1, acceptanceRate: 35, tuitionPerYear: 16000, currency: "EUR", tags: ["Engineering", "Aerospace", "STEM"], gpa: 3.7, ielts: 6.5, website: "https://tudelft.nl", blurb: "Europe's top technical university for engineering and design." },
  { id: "uva", name: "University of Amsterdam", shortName: "UvA", country: "Netherlands", city: "Amsterdam", rankWorld: 53, rankNational: 2, acceptanceRate: 45, tuitionPerYear: 14000, currency: "EUR", tags: ["Social Sciences", "AI", "Research"], gpa: 3.5, ielts: 6.5, website: "https://uva.nl", blurb: "A leading European research university in the heart of Amsterdam." },
  // Italy
  { id: "polimi", name: "Politecnico di Milano", shortName: "PoliMi", country: "Italy", city: "Milan", rankWorld: 111, rankNational: 1, acceptanceRate: 50, tuitionPerYear: 3900, currency: "EUR", tags: ["Engineering", "Design", "Architecture"], gpa: 3.5, ielts: 6, website: "https://polimi.it", blurb: "Italy's top technical university for engineering and design." },
  { id: "bologna", name: "University of Bologna", shortName: "Bologna", country: "Italy", city: "Bologna", rankWorld: 154, rankNational: 2, acceptanceRate: 55, tuitionPerYear: 3000, currency: "EUR", tags: ["Humanities", "Law", "Research"], gpa: 3.4, ielts: 6, website: "https://unibo.it", blurb: "The oldest university in the world, founded in 1088." },
  // Spain
  { id: "ub", name: "University of Barcelona", shortName: "UB", country: "Spain", city: "Barcelona", rankWorld: 164, rankNational: 1, acceptanceRate: 55, tuitionPerYear: 3000, currency: "EUR", tags: ["Medicine", "Sciences", "Research"], gpa: 3.4, ielts: 6, website: "https://ub.edu", blurb: "Spain's leading research university by the Mediterranean." },
  { id: "uam", name: "Autonomous University of Madrid", shortName: "UAM", country: "Spain", city: "Madrid", rankWorld: 198, rankNational: 2, acceptanceRate: 50, tuitionPerYear: 2500, currency: "EUR", tags: ["Sciences", "Law", "Economics"], gpa: 3.4, ielts: 6, website: "https://uam.es", blurb: "A top Madrid research university with strong sciences." },
  // Sweden
  { id: "kth", name: "KTH Royal Institute of Technology", shortName: "KTH", country: "Sweden", city: "Stockholm", rankWorld: 73, rankNational: 1, acceptanceRate: 35, tuitionPerYear: 155000, currency: "SEK", tags: ["Engineering", "Technology", "STEM"], gpa: 3.6, ielts: 6.5, website: "https://kth.se", blurb: "Scandinavia's largest technical research university." },
  { id: "lund", name: "Lund University", shortName: "Lund", country: "Sweden", city: "Lund", rankWorld: 85, rankNational: 2, acceptanceRate: 40, tuitionPerYear: 140000, currency: "SEK", tags: ["Research", "Innovation", "Sciences"], gpa: 3.5, ielts: 6.5, website: "https://lunduniversity.lu.se", blurb: "A top-ranked, innovation-driven Swedish university." },
  // Norway
  { id: "uio", name: "University of Oslo", shortName: "UiO", country: "Norway", city: "Oslo", rankWorld: 117, rankNational: 1, acceptanceRate: 45, tuitionPerYear: 0, currency: "NOK", tags: ["Research", "Sciences", "Law"], gpa: 3.4, ielts: 6.5, website: "https://uio.no", blurb: "Norway's oldest and largest tuition-free university.", livingCost: 140000 },
  { id: "ntnu", name: "Norwegian University of Science and Technology", shortName: "NTNU", country: "Norway", city: "Trondheim", rankWorld: 101, rankNational: 2, acceptanceRate: 50, tuitionPerYear: 0, currency: "NOK", tags: ["Engineering", "Technology", "STEM"], gpa: 3.5, ielts: 6.5, website: "https://ntnu.edu", blurb: "Norway's primary institution for engineering and technology.", livingCost: 135000 },
  // Finland
  { id: "aalto", name: "Aalto University", shortName: "Aalto", country: "Finland", city: "Espoo", rankWorld: 109, rankNational: 1, acceptanceRate: 30, tuitionPerYear: 15000, currency: "EUR", tags: ["Design", "Engineering", "Business"], gpa: 3.6, ielts: 6.5, website: "https://aalto.fi", blurb: "Finland's hub for design, technology and entrepreneurship." },
  { id: "helsinki", name: "University of Helsinki", shortName: "Helsinki", country: "Finland", city: "Helsinki", rankWorld: 115, rankNational: 2, acceptanceRate: 40, tuitionPerYear: 13000, currency: "EUR", tags: ["Research", "Sciences", "Medicine"], gpa: 3.5, ielts: 6.5, website: "https://helsinki.fi", blurb: "Finland's largest and most prestigious research university." },
  // Denmark
  { id: "ku", name: "University of Copenhagen", shortName: "UCPH", country: "Denmark", city: "Copenhagen", rankWorld: 107, rankNational: 1, acceptanceRate: 41, tuitionPerYear: 120000, currency: "DKK", tags: ["Research", "Medicine", "Sciences"], gpa: 3.5, ielts: 6.5, website: "https://ku.dk", blurb: "Denmark's oldest and top-ranked research university." },
  { id: "dtu", name: "Technical University of Denmark", shortName: "DTU", country: "Denmark", city: "Lyngby", rankWorld: 104, rankNational: 2, acceptanceRate: 38, tuitionPerYear: 110000, currency: "DKK", tags: ["Engineering", "Technology", "STEM"], gpa: 3.6, ielts: 6.5, website: "https://dtu.dk", blurb: "A leading European technical university near Copenhagen." },
  // Australia
  { id: "sydney", name: "University of Sydney", shortName: "Sydney", country: "Australia", city: "Sydney", rankWorld: 18, rankNational: 2, acceptanceRate: 30, tuitionPerYear: 50000, currency: "AUD", tags: ["Research", "Medicine", "Business"], gpa: 3.6, ielts: 6.5, website: "https://sydney.edu.au", blurb: "Australia's first university and a global top-20 institution." },
  { id: "anu", name: "Australian National University", shortName: "ANU", country: "Australia", city: "Canberra", rankWorld: 30, rankNational: 1, acceptanceRate: 35, tuitionPerYear: 47000, currency: "AUD", tags: ["Research", "Policy", "Sciences"], gpa: 3.6, ielts: 6.5, website: "https://anu.edu.au", blurb: "Australia's national research university in the capital." },
  // New Zealand
  { id: "auckland", name: "University of Auckland", shortName: "Auckland", country: "New Zealand", city: "Auckland", rankWorld: 65, rankNational: 1, acceptanceRate: 45, tuitionPerYear: 40000, currency: "NZD", tags: ["Research", "Engineering", "Business"], gpa: 3.4, ielts: 6.5, website: "https://auckland.ac.nz", blurb: "New Zealand's highest-ranked, most comprehensive university." },
  { id: "otago", name: "University of Otago", shortName: "Otago", country: "New Zealand", city: "Dunedin", rankWorld: 206, rankNational: 2, acceptanceRate: 55, tuitionPerYear: 35000, currency: "NZD", tags: ["Medicine", "Sciences", "Research"], gpa: 3.3, ielts: 6, website: "https://otago.ac.nz", blurb: "New Zealand's oldest university, strong in health sciences." },
  // Singapore
  { id: "ntu", name: "Nanyang Technological University", shortName: "NTU Singapore", country: "Singapore", city: "Singapore", rankWorld: 26, rankNational: 2, acceptanceRate: 25, tuitionPerYear: 38000, currency: "SGD", tags: ["Engineering", "Technology", "Business"], gpa: 3.7, ielts: 6.5, website: "https://ntu.edu.sg", blurb: "A young, fast-rising global technological university." },
  // Japan
  { id: "tokyo", name: "University of Tokyo", shortName: "UTokyo", country: "Japan", city: "Tokyo", rankWorld: 28, rankNational: 1, acceptanceRate: 35, tuitionPerYear: 535800, currency: "JPY", tags: ["Research", "Engineering", "Sciences"], gpa: 3.7, ielts: 7, website: "https://u-tokyo.ac.jp", blurb: "Japan's most prestigious national research university.", livingCost: 1500000 },
  { id: "kyoto", name: "Kyoto University", shortName: "Kyoto", country: "Japan", city: "Kyoto", rankWorld: 46, rankNational: 2, acceptanceRate: 38, tuitionPerYear: 535800, currency: "JPY", tags: ["Research", "Sciences", "Innovation"], gpa: 3.6, ielts: 6.5, website: "https://kyoto-u.ac.jp", blurb: "A Nobel-laureate-rich university famed for free thinking.", livingCost: 1300000 },
  // South Korea
  { id: "snu", name: "Seoul National University", shortName: "SNU", country: "South Korea", city: "Seoul", rankWorld: 41, rankNational: 1, acceptanceRate: 20, tuitionPerYear: 12000000, currency: "KRW", tags: ["Research", "Engineering", "Business"], gpa: 3.7, ielts: 6.5, website: "https://snu.ac.kr", blurb: "South Korea's flagship national university.", livingCost: 14000000 },
  { id: "kaist", name: "Korea Advanced Institute of Science & Technology", shortName: "KAIST", country: "South Korea", city: "Daejeon", rankWorld: 56, rankNational: 2, acceptanceRate: 30, tuitionPerYear: 9000000, currency: "KRW", tags: ["Engineering", "AI", "STEM"], gpa: 3.7, ielts: 6.5, website: "https://kaist.ac.kr", blurb: "Korea's premier science and technology research institute.", livingCost: 12000000 },
  // China
  { id: "pku", name: "Peking University", shortName: "Peking", country: "China", city: "Beijing", rankWorld: 14, rankNational: 1, acceptanceRate: 16, tuitionPerYear: 30000, currency: "CNY", tags: ["Research", "Humanities", "Sciences"], gpa: 3.8, ielts: 6.5, website: "https://pku.edu.cn", blurb: "China's most prestigious comprehensive university." },
  { id: "fudan", name: "Fudan University", shortName: "Fudan", country: "China", city: "Shanghai", rankWorld: 39, rankNational: 3, acceptanceRate: 20, tuitionPerYear: 28000, currency: "CNY", tags: ["Business", "Medicine", "Research"], gpa: 3.7, ielts: 6.5, website: "https://fudan.edu.cn", blurb: "A leading Shanghai university strong in business and medicine." },
  // United Arab Emirates
  { id: "nyuad", name: "New York University Abu Dhabi", shortName: "NYU Abu Dhabi", country: "United Arab Emirates", city: "Abu Dhabi", rankWorld: 230, rankNational: 1, acceptanceRate: 4, tuitionPerYear: 78000, currency: "AED", tags: ["Liberal Arts", "Research", "Sciences"], gpa: 3.8, ielts: 7, sat: 1450, website: "https://nyuad.nyu.edu", blurb: "NYU's highly selective liberal-arts campus in the Gulf." },
  { id: "khalifa", name: "Khalifa University", shortName: "Khalifa", country: "United Arab Emirates", city: "Abu Dhabi", rankWorld: 230, rankNational: 2, acceptanceRate: 30, tuitionPerYear: 70000, currency: "AED", tags: ["Engineering", "Technology", "STEM"], gpa: 3.6, ielts: 6.5, website: "https://ku.ac.ae", blurb: "The UAE's top research university for science and engineering." },
  // Turkey
  { id: "bogazici", name: "Boğaziçi University", shortName: "Boğaziçi", country: "Turkey", city: "Istanbul", rankWorld: 701, rankNational: 1, acceptanceRate: 10, tuitionPerYear: 24000, currency: "TRY", tags: ["Engineering", "Economics", "Research"], gpa: 3.6, ielts: 6.5, website: "https://bogazici.edu.tr", blurb: "Turkey's most selective, English-taught flagship university." },
  { id: "metu", name: "Middle East Technical University", shortName: "METU", country: "Turkey", city: "Ankara", rankWorld: 660, rankNational: 2, acceptanceRate: 15, tuitionPerYear: 22000, currency: "TRY", tags: ["Engineering", "Technology", "STEM"], gpa: 3.5, ielts: 6, website: "https://metu.edu.tr", blurb: "Turkey's leading technical research university." },
  // Malaysia
  { id: "um", name: "University of Malaya", shortName: "UM", country: "Malaysia", city: "Kuala Lumpur", rankWorld: 60, rankNational: 1, acceptanceRate: 25, tuitionPerYear: 30000, currency: "MYR", tags: ["Research", "Engineering", "Medicine"], gpa: 3.5, ielts: 6, website: "https://um.edu.my", blurb: "Malaysia's oldest and highest-ranked university." },
  { id: "usm", name: "Universiti Sains Malaysia", shortName: "USM", country: "Malaysia", city: "Penang", rankWorld: 137, rankNational: 2, acceptanceRate: 35, tuitionPerYear: 26000, currency: "MYR", tags: ["Sciences", "Engineering", "Research"], gpa: 3.3, ielts: 6, website: "https://usm.my", blurb: "Malaysia's APEX research-intensive science university." },
  // Uzbekistan
  { id: "nuuz", name: "National University of Uzbekistan", shortName: "NUUz", country: "Uzbekistan", city: "Tashkent", rankWorld: 1001, rankNational: 1, acceptanceRate: 40, tuitionPerYear: 30000000, currency: "UZS", tags: ["Sciences", "Research", "Humanities"], gpa: 3.3, ielts: 5.5, website: "https://nuu.uz", blurb: "Uzbekistan's oldest and largest national university.", livingCost: 24000000 },
  { id: "inha-tashkent", name: "Inha University in Tashkent", shortName: "Inha Tashkent", country: "Uzbekistan", city: "Tashkent", rankWorld: 1201, rankNational: 2, acceptanceRate: 45, tuitionPerYear: 35000000, currency: "UZS", tags: ["Computer Science", "Engineering", "IT"], gpa: 3.2, ielts: 6, website: "https://inha.uz", blurb: "A Korean-partnered IT and engineering university in Tashkent.", livingCost: 22000000 },
  { id: "westminster-tashkent", name: "Westminster International University in Tashkent", shortName: "WIUT", country: "Uzbekistan", city: "Tashkent", rankWorld: 1201, rankNational: 3, acceptanceRate: 50, tuitionPerYear: 40000000, currency: "UZS", tags: ["Business", "Economics", "Law"], gpa: 3.2, ielts: 6, website: "https://wiut.uz", blurb: "A UK-affiliated, English-taught university in Tashkent.", livingCost: 22000000 },
  // Kazakhstan
  { id: "nu", name: "Nazarbayev University", shortName: "Nazarbayev", country: "Kazakhstan", city: "Astana", rankWorld: 350, rankNational: 1, acceptanceRate: 20, tuitionPerYear: 0, currency: "KZT", tags: ["Engineering", "Sciences", "Research"], gpa: 3.6, ielts: 6.5, sat: 1300, website: "https://nu.edu.kz", blurb: "Kazakhstan's English-medium flagship, mostly scholarship-funded.", livingCost: 2500000 },
  { id: "kaznu", name: "Al-Farabi Kazakh National University", shortName: "KazNU", country: "Kazakhstan", city: "Almaty", rankWorld: 150, rankNational: 2, acceptanceRate: 40, tuitionPerYear: 2000000, currency: "KZT", tags: ["Research", "Sciences", "Humanities"], gpa: 3.3, ielts: 5.5, website: "https://kaznu.kz", blurb: "Kazakhstan's oldest and largest classical university.", livingCost: 2000000 },
  // Russia
  { id: "msu", name: "Lomonosov Moscow State University", shortName: "MSU", country: "Russia", city: "Moscow", rankWorld: 87, rankNational: 1, acceptanceRate: 18, tuitionPerYear: 400000, currency: "RUB", tags: ["Research", "Sciences", "Mathematics"], gpa: 3.7, ielts: 6, website: "https://msu.ru", blurb: "Russia's most prestigious and oldest university.", livingCost: 500000 },
  { id: "hse", name: "HSE University", shortName: "HSE", country: "Russia", city: "Moscow", rankWorld: 300, rankNational: 3, acceptanceRate: 30, tuitionPerYear: 450000, currency: "RUB", tags: ["Economics", "Computer Science", "Social Sciences"], gpa: 3.5, ielts: 6, website: "https://hse.ru", blurb: "A modern Russian leader in economics, data and social science.", livingCost: 550000 },
  { id: "spbu", name: "Saint Petersburg State University", shortName: "SPbU", country: "Russia", city: "Saint Petersburg", rankWorld: 270, rankNational: 2, acceptanceRate: 25, tuitionPerYear: 380000, currency: "RUB", tags: ["Research", "Humanities", "Sciences"], gpa: 3.5, ielts: 6, website: "https://spbu.ru", blurb: "Russia's second-oldest university on the Baltic coast.", livingCost: 480000 },
];

export const universities: University[] = [
  ...featured.map((u) => ({ ...u, website: u.website ?? `https://www.${u.id}.edu` })),
  ...rawUniversities.map(makeUniversity),
];

export function getUniversity(id: string) {
  return universities.find((u) => u.id === id);
}

export const countries = [...new Set(universities.map((u) => u.country))].sort();
export const allTags = [...new Set(universities.flatMap((u) => u.tags))].sort();
