import { getUniversity } from "@/lib/data/universities";
import type { University } from "@/lib/types";

export type Lang = "en" | "ru" | "uz";

export interface MentorProfile {
  name: string;
  gpa: number | null;
  gpaScale: number;
  ielts: number | null;
  sat: number | null;
  major: string;
  intake: string;
  degreeLevel: string;
  budget: number | null;
  countries: string[];
  dreamUniversities: string[];
}

const DEFAULT_PROFILE: MentorProfile = {
  name: "there",
  gpa: null,
  gpaScale: 4,
  ielts: null,
  sat: null,
  major: "your field",
  intake: "your intake",
  degreeLevel: "",
  budget: null,
  countries: [],
  dreamUniversities: [],
};

/* -------------------------------------------------------------------------- */
/*  Language detection (EN / RU / UZ)                                         */
/* -------------------------------------------------------------------------- */

const UZ_LATIN = [
  "qanday", "qilish", "universitet", "kirish", "uchun", "talab", "ball", "stipendiya",
  "men", "mening", "yordam", "imkoniyat", "ariza", "reja", "grant", "qabul", "esse",
  "insho", "solishtir", "taqqosla", "qaysi", "yaxshi", "foiz", "bo'l", "o'q", "shans",
];

export function detectLanguage(text: string): Lang {
  const t = text.toLowerCase();
  const hasCyrillic = /[Ѐ-ӿ]/.test(text);
  if (hasCyrillic) {
    // Uzbek-specific Cyrillic letters → Uzbek, otherwise Russian.
    if (/[ўқғҳ]/.test(t)) return "uz";
    return "ru";
  }
  const uzHits = UZ_LATIN.filter((w) => t.includes(w)).length;
  if (uzHits >= 1) return "uz";
  return "en";
}

/* -------------------------------------------------------------------------- */
/*  Cross-language university recognition                                     */
/* -------------------------------------------------------------------------- */

const UNI_ALIASES: { id: string; aliases: string[] }[] = [
  { id: "harvard", aliases: ["harvard", "гарвард", "гарвардский", "garvard"] },
  { id: "mit", aliases: ["mit", "массачусет", "мит", "m.i.t"] },
  { id: "stanford", aliases: ["stanford", "стэнфорд", "стенфорд", "stenford"] },
  { id: "oxford", aliases: ["oxford", "оксфорд", "oksford"] },
  { id: "cambridge", aliases: ["cambridge", "кембридж", "kembrij"] },
  { id: "eth", aliases: ["eth", "eth zurich", "eth zürich", "цюрих", "цюрихе", "tsyurix", "etx"] },
  { id: "epfl", aliases: ["epfl", "лозанн", "lozann"] },
  { id: "tum", aliases: ["tum", "мюнхен", "munich", "myunxen", "технический университет мюнхена"] },
  { id: "toronto", aliases: ["toronto", "торонто"] },
  { id: "nus", aliases: ["nus", "сингапур", "singapur", "national university of singapore"] },
  { id: "ucl", aliases: ["ucl", "university college london"] },
  { id: "tsinghua", aliases: ["tsinghua", "цинхуа", "tsinxua"] },
  { id: "tokyo", aliases: ["university of tokyo", "utokyo", "токио", "tokio"] },
  { id: "snu", aliases: ["seoul national", "snu", "сеул", "seul"] },
];

export function findUniversity(text: string): University | undefined {
  const t = text.toLowerCase();
  for (const { id, aliases } of UNI_ALIASES) {
    if (aliases.some((a) => t.includes(a))) {
      const u = getUniversity(id);
      if (u) return u;
    }
  }
  return undefined;
}

/* -------------------------------------------------------------------------- */
/*  Intent detection                                                          */
/* -------------------------------------------------------------------------- */

type Intent = "chances" | "essay" | "roadmap" | "scholarship" | "compare" | "default";

const INTENT_KEYWORDS: Record<Exclude<Intent, "default">, string[]> = {
  chances: ["chance", "odds", "get in", "admit", "probab", "шанс", "поступ", "вероятн", "примут", "imkoniyat", "qabul", "kira", "foiz", "shans"],
  essay: ["essay", "personal statement", "intro", "motivation", "эссе", "сочинение", "мотивацион", "esse", "insho", "bayonot"],
  roadmap: ["roadmap", "plan", "timeline", "schedule", "steps", "план", "дорожн", "график", "этап", "reja", "bosqich", "jadval", "qadam"],
  scholarship: ["scholarship", "funding", "money", "afford", "grant", "стипенди", "финансиров", "грант", "деньги", "оплат", "stipendiya", "moliyalash", "pul"],
  compare: ["compare", " vs ", "versus", "better", "difference", "сравн", "против", "лучше", "разниц", "solishtir", "taqqosla", "farq"],
};

function detectIntent(text: string): Intent {
  const t = ` ${text.toLowerCase()} `;
  for (const intent of ["compare", "scholarship", "essay", "roadmap", "chances"] as const) {
    if (INTENT_KEYWORDS[intent].some((k) => t.includes(k))) return intent;
  }
  return "default";
}

/* -------------------------------------------------------------------------- */
/*  Localized helpers                                                         */
/* -------------------------------------------------------------------------- */

function profileLine(p: MentorProfile, lang: Lang): string {
  const gpa = p.gpa != null ? `${p.gpa}/${p.gpaScale}` : "—";
  const ielts = p.ielts != null ? `${p.ielts}` : "—";
  const sat = p.sat != null ? `${p.sat}` : "—";
  if (lang === "ru") return `GPA ${gpa}, IELTS ${ielts}, SAT ${sat}`;
  if (lang === "uz") return `GPA ${gpa}, IELTS ${ielts}, SAT ${sat}`;
  return `GPA ${gpa}, IELTS ${ielts}, SAT ${sat}`;
}

/** Rough competitiveness read: compares profile to a university's bar. */
function verdict(p: MentorProfile, u: University, lang: Lang): string {
  const gpaOk = p.gpa != null ? p.gpa / p.gpaScale >= u.requirements.gpa / 4 - 0.03 : false;
  const ieltsOk = p.ielts != null ? p.ielts >= u.requirements.ielts : false;
  const reach = u.acceptanceRate < 12;
  const strong = gpaOk && ieltsOk && !reach;
  if (lang === "ru") {
    return strong
      ? "Вы конкурентоспособны — рассматривайте как реалистичную цель."
      : "Это «reach»-вариант: усильте эссе и рекомендации, чтобы повысить шансы.";
  }
  if (lang === "uz") {
    return strong
      ? "Siz raqobatbardoshsiz — buni real maqsad sifatida ko'ring."
      : "Bu murakkab variant: imkoniyatni oshirish uchun esse va tavsiyalarni kuchaytiring.";
  }
  return strong
    ? "You're competitive — treat it as a realistic target."
    : "It's a reach — strengthen your essays and recommendations to lift your odds.";
}

/* -------------------------------------------------------------------------- */
/*  Localized reply templates                                                 */
/* -------------------------------------------------------------------------- */

function replyChances(p: MentorProfile, u: University | undefined, lang: Lang): string {
  if (u) {
    const sat = u.requirements.sat ? `, SAT ${u.requirements.sat}` : "";
    if (lang === "ru") {
      return `Вот как я оцениваю ваши шансы в **${u.shortName}**:

- **Процент приёма:** ~${u.acceptanceRate}%
- **Обычная планка:** GPA ≈ ${u.requirements.gpa}, IELTS ${u.requirements.ielts}${sat}
- **Ваш профиль:** ${profileLine(p, lang)}

${verdict(p, u, lang)}

Хотите, я составлю план действий, чтобы усилить заявку?`;
    }
    if (lang === "uz") {
      return `**${u.shortName}** uchun imkoniyatlaringizni shunday baholayman:

- **Qabul foizi:** ~${u.acceptanceRate}%
- **Odatdagi talab:** GPA ≈ ${u.requirements.gpa}, IELTS ${u.requirements.ielts}${sat}
- **Sizning profilingiz:** ${profileLine(p, lang)}

${verdict(p, u, lang)}

Arizani kuchaytirish uchun harakat rejasini tuzib beraymi?`;
    }
    return `Here's how I read your odds at **${u.shortName}**:

- **Acceptance rate:** ~${u.acceptanceRate}%
- **Typical bar:** GPA ≈ ${u.requirements.gpa}, IELTS ${u.requirements.ielts}${sat}
- **Your profile:** ${profileLine(p, lang)}

${verdict(p, u, lang)}

Want me to build an action plan to strengthen your application?`;
  }
  // No specific university recognized.
  if (lang === "ru") {
    return `С вашим профилем (${profileLine(p, lang)}) вы — сильный кандидат для целевых вузов и имеете реальный шанс на пару «reach»-вариантов. Главные рычаги сейчас — **эссе** и **вторая сильная рекомендация**. Назовите конкретный университет, и я дам точную оценку шансов.`;
  }
  if (lang === "uz") {
    return `Sizning profilingiz bilan (${profileLine(p, lang)}) siz maqsadli universitetlar uchun kuchli nomzodsiz va bir nechta murakkab variantlarga ham imkoniyatingiz bor. Asosiy omillar — **esse** va **ikkinchi kuchli tavsiyanoma**. Aniq universitet nomini ayting, men aniq baho beraman.`;
  }
  return `With your profile (${profileLine(p, lang)}) you're a strong candidate for target schools and have a real shot at a couple of reaches. The biggest levers are your **essays** and a **second strong recommendation**. Name a specific university and I'll give you a precise estimate.`;
}

function replyEssay(p: MentorProfile, lang: Lang): string {
  if (lang === "ru") {
    return `Давайте выстроим личное заявление, которое ценят приёмные комиссии.

**Проверенная структура из 5 шагов:**
1. **Зацепка** — конкретный момент (не «с детства…»).
2. **Напряжение** — проблема, которая вас увлекла.
3. **Действие** — что именно сделали *вы*.
4. **Рефлексия** — как это изменило ваше мышление.
5. **Мост** — связь с вашей специальностью (${p.major}).

Вставьте абзац черновика — я дам построчную обратную связь по тону и убедительности.`;
  }
  if (lang === "uz") {
    return `Keling, qabul komissiyalari qadrlaydigan shaxsiy bayonot tuzamiz.

**Sinovdan o'tgan 5 bosqichli tuzilma:**
1. **Ilgak** — aniq lahza ("bolaligimdan…" emas).
2. **Ziddiyat** — sizni qiziqtirgan muammo.
3. **Harakat** — aynan *siz* nima qilgansiz.
4. **Mulohaza** — bu fikrlashingizni qanday o'zgartirdi.
5. **Ko'prik** — yo'nalishingiz bilan bog'liqlik (${p.major}).

Bir paragraf qoralama yuboring — ohang va ta'sirchanlik bo'yicha satrma-satr fikr bildiraman.`;
  }
  return `Let's structure a personal statement that admissions readers reward.

**A proven 5-beat structure:**
1. **Hook** — a specific moment (not "Ever since I was young…").
2. **Tension** — the problem that pulled you in.
3. **Action** — what *you* did, concretely.
4. **Reflection** — what it changed about how you think.
5. **Bridge** — how it connects to your major (${p.major}).

Paste a draft paragraph and I'll give line-level feedback on tone, specificity and impact.`;
}

function replyRoadmap(p: MentorProfile, lang: Lang): string {
  if (lang === "ru") {
    return `Вот ориентировочный план для поступления (**${p.intake}**):

- **Сейчас → лето** · Финализируйте список из 8 вузов и рассчитайте вероятности.
- **Лето → осень** · Черновик эссе, 2 рекомендателя, дополнительные эссе.
- **Осень → январь** · Подача ранних раундов, заявки на стипендии, подготовка к интервью.
- **Февраль → лето** · Сравнение офферов, принятие лучшего, студенческая виза.

Открыть полную версию во вкладке «Roadmap»?`;
  }
  if (lang === "uz") {
    return `**${p.intake}** uchun taxminiy reja:

- **Hozir → yoz** · 8 ta universitet ro'yxatini yakunlang va ehtimollarni hisoblang.
- **Yoz → kuz** · Esse qoralamasi, 2 ta tavsiyanoma, qo'shimcha esselar.
- **Kuz → yanvar** · Erta turdagi arizalar, stipendiyalar, suhbatga tayyorgarlik.
- **Fevral → yoz** · Takliflarni solishtirish, eng yaxshisini tanlash, talaba vizasi.

To'liq versiyani "Roadmap" bo'limida ochaymi?`;
  }
  return `Here's a tailored roadmap for **${p.intake}** entry:

- **Now → summer** · Finalize your list of 8 schools and run admission probabilities.
- **Summer → fall** · Draft your essay, secure 2 recommenders, polish supplementals.
- **Fall → January** · Submit early rounds, apply for scholarships, prep interviews.
- **February → summer** · Compare offers, accept the best fit, complete your student visa.

Want me to populate the full milestone view in your Roadmap tab?`;
}

function replyScholarship(p: MentorProfile, lang: Lang): string {
  if (lang === "ru") {
    return `С вашим профилем вы подходите как минимум под **четыре финансируемых маршрута**:

1. **ETH ESOP Excellence** — CHF 12 000/семестр.
2. **Toronto Lester B. Pearson** — полное покрытие (обучение + проживание).
3. **DAAD (для TUM)** — €934/мес.
4. **Knight-Hennessy (Stanford)** — полное финансирование.

Добавить эти дедлайны в ваш трекер?`;
  }
  if (lang === "uz") {
    return `Sizning profilingiz bilan kamida **to'rtta moliyalashtirilgan yo'nalish**ga mosroqsiz:

1. **ETH ESOP Excellence** — semestriga CHF 12 000.
2. **Toronto Lester B. Pearson** — to'liq qoplash (o'qish + yashash).
3. **DAAD (TUM uchun)** — oyiga €934.
4. **Knight-Hennessy (Stanford)** — to'liq moliyalashtirish.

Ushbu muddatlarni trekeringizga qo'shaymi?`;
  }
  return `Based on your profile, you qualify for at least **four funded routes**:

1. **ETH ESOP Excellence** — CHF 12,000/semester.
2. **Toronto Lester B. Pearson** — full ride (tuition + living).
3. **DAAD (for TUM)** — €934/month.
4. **Knight-Hennessy (Stanford)** — full funding.

Shall I add these deadlines to your tracker?`;
}

function replyCompare(u: University | undefined, lang: Lang): string {
  const name = u?.shortName ?? "ETH Zürich";
  if (lang === "ru") {
    return `Сравнение для **${name}** и сопоставимых вузов:

- **Рейтинг и сила программы** — оба входят в мировую элиту по вашему направлению.
- **Стоимость** — государственные вузы ЕС часто почти бесплатны; США/Великобритания дороже.
- **Язык** — проверьте, ведётся ли программа полностью на английском.

Назовите два конкретных университета — я сделаю детальную таблицу.`;
  }
  if (lang === "uz") {
    return `**${name}** va shunga o'xshash universitetlar uchun taqqoslash:

- **Reyting va dastur kuchi** — ikkalasi ham yo'nalishingiz bo'yicha jahon elitasida.
- **Narx** — Yevropa davlat universitetlari ko'pincha deyarli bepul; AQSh/Buyuk Britaniya qimmatroq.
- **Til** — dastur to'liq ingliz tilida ekanini tekshiring.

Ikkita aniq universitet nomini ayting — batafsil jadval tuzaman.`;
  }
  return `Comparison for **${name}** and similar schools:

- **Rank & program strength** — both sit in the global elite for your field.
- **Cost** — public EU universities are often near-free; US/UK run higher.
- **Language** — check whether the program is fully English-taught.

Name two specific universities and I'll build a detailed side-by-side table.`;
}

function replyDefault(p: MentorProfile, u: University | undefined, lang: Lang): string {
  if (u) return replyChances(p, u, lang);
  if (lang === "ru") {
    return `Отличный вопрос. С учётом вашего профиля (${profileLine(p, lang)}, специальность: ${p.major}) — вы конкурентоспособный кандидат. Уточните, что для вас важнее: престиж, стоимость, локация или стипендии, и я дам точную рекомендацию.`;
  }
  if (lang === "uz") {
    return `Ajoyib savol. Profilingizni hisobga olsak (${profileLine(p, lang)}, yo'nalish: ${p.major}) — siz raqobatbardosh nomzodsiz. Siz uchun nima muhimroq ekanini ayting: nufuz, narx, joylashuv yoki stipendiya — men aniq tavsiya beraman.`;
  }
  return `Great question. Based on your profile (${profileLine(p, lang)}, major: ${p.major}) you're a competitive applicant. Tell me what you're optimizing for — prestige, cost, location or scholarships — and I'll give you a precise recommendation.`;
}

/* -------------------------------------------------------------------------- */
/*  Public entry point                                                        */
/* -------------------------------------------------------------------------- */

export function generateMentorReply(prompt: string, profile?: MentorProfile): string {
  const p = profile ?? DEFAULT_PROFILE;
  const lang = detectLanguage(prompt);
  const university = findUniversity(prompt);
  const intent = detectIntent(prompt);

  switch (intent) {
    case "chances":
      return replyChances(p, university, lang);
    case "essay":
      return replyEssay(p, lang);
    case "roadmap":
      return replyRoadmap(p, lang);
    case "scholarship":
      return replyScholarship(p, lang);
    case "compare":
      return replyCompare(university, lang);
    default:
      return replyDefault(p, university, lang);
  }
}

export function buildWelcome(p: MentorProfile): string {
  const bits: string[] = [];
  if (p.gpa != null) bits.push(`${p.gpa} GPA`);
  if (p.ielts != null) bits.push(`IELTS ${p.ielts}`);
  if (p.sat != null) bits.push(`SAT ${p.sat}`);
  const summary = bits.length ? ` I've reviewed your profile — ${bits.join(", ")}, targeting ${p.major} for ${p.intake}.` : "";
  return `Hi ${p.name} 👋 I'm your AdmitFlow mentor.${summary} Ask me anything about universities, essays, scholarships or deadlines — in English, Русский or O'zbek — and I'll reply in your language.`;
}
