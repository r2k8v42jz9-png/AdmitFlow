// Prompt starters shown in the empty mentor chat. These are UI guidance
// (suggested questions), not fabricated user data.
export const suggestionChips = [
  "Estimate my chances at Stanford",
  "Build a roadmap for Fall 2027",
  "Which scholarships fit my profile?",
  "Review my essay introduction",
  "Compare ETH Zürich vs TUM",
  "What's a balanced university list for me?",
];

const suggestionChipsRu = [
  "Оцени мои шансы в Stanford",
  "Построй план на набор Fall 2027",
  "Какие стипендии мне подходят?",
  "Проверь вступление моего эссе",
  "Сравни ETH Zürich и TUM",
  "Какой сбалансированный список вузов для меня?",
];

/** Locale-aware prompt starters for the empty mentor chat. */
export function getSuggestionChips(locale: "en" | "ru"): string[] {
  return locale === "ru" ? suggestionChipsRu : suggestionChips;
}

export const welcomeMessage =
  "Hi Aziz 👋 I'm your AdmitFlow mentor. I've reviewed your profile — 3.84 GPA, IELTS 7.5, SAT 1520, targeting Computer Science for Fall 2027. Ask me anything about universities, essays, scholarships or deadlines, and I'll tailor every answer to you.";

/** Deterministic mock "AI" responses keyed by intent for the streaming simulation. */
export function mockMentorReply(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("chance") || p.includes("odds") || p.includes("get in") || p.includes("stanford") || p.includes("mit")) {
    return `Here's how I read your odds with your current profile:

**Reach** — Stanford ~24%, MIT ~31%. Your 1520 SAT and robotics medal are strong, but these schools admit fewer than 4%, so treat them as upside.

**Target** — ETH Zürich ~58%, TUM ~63%, Toronto ~71%. Excellent value and a great fit for your STEM strengths.

**To move the needle:**
1. Add a second STEM recommendation that speaks to your research ability.
2. Reframe your essay around *impact and curiosity*, not just technical depth.
3. Lock in Early Action for MIT — it lifts admit rates by roughly 1.5×.

Want me to draft an action plan for any of these?`;
  }

  if (p.includes("essay") || p.includes("personal statement") || p.includes("intro")) {
    return `Great — let's structure a personal statement that admissions readers reward.

**A proven 5-beat structure:**
1. **Hook** — a specific, sensory moment (not "Ever since I was young…").
2. **Tension** — the problem or question that pulled you in.
3. **Action** — what *you* did, in concrete detail.
4. **Reflection** — what it changed about how you think.
5. **Bridge** — how this connects to your intended major and future.

Your robotics project is a perfect spine for this. Start in the middle of a failure — the night something didn't work — then zoom out.

Paste a draft paragraph and I'll give you line-level feedback on tone, specificity and impact.`;
  }

  if (p.includes("roadmap") || p.includes("plan") || p.includes("timeline")) {
    return `Here's a tailored roadmap for **Fall 2027** entry:

- **Now → Jun** · Finalize your balanced list of 8 schools and run admission probabilities.
- **Jul → Sep** · Draft the personal statement, secure 2 recommenders, polish supplementals.
- **Oct → Jan** · Submit Early Action rounds, apply for scholarships, prep interviews.
- **Feb → Jul** · Compare offers, accept the best fit, complete your student visa.

You're currently in the *shortlist* phase and slightly ahead of schedule. I can generate the full milestone view in your Roadmap tab — want me to populate the tasks?`;
  }

  if (p.includes("scholarship") || p.includes("funding") || p.includes("money") || p.includes("afford")) {
    return `Based on your profile, you qualify for at least **four funded routes**:

1. **ETH ESOP Excellence** — CHF 12,000/semester, deadline Dec 15.
2. **Toronto Lester B. Pearson** — full ride (tuition + living), deadline Nov 30.
3. **DAAD (for TUM)** — €934/month, deadline Nov 30.
4. **Knight-Hennessy (Stanford grad)** — full funding, deadline Oct 10.

With your $45k budget, ETH and TUM are essentially tuition-free even before scholarships. Shall I add these deadlines to your tracker?`;
  }

  if (p.includes("compare") || p.includes("vs") || p.includes("versus") || p.includes("eth") || p.includes("tum")) {
    return `**ETH Zürich vs TUM — quick comparison:**

| | ETH Zürich | TUM |
|---|---|---|
| World rank | #7 | #28 |
| Tuition / yr | ~CHF 1,460 | €0 |
| Living cost | High (Zürich) | Moderate (Munich) |
| Language | English (MSc) | English + some German |
| Your fit score | 91 | 90 |

**Verdict:** ETH edges ahead on prestige and research; TUM wins on cost of living and is fully tuition-free. Both are likely matches for you. If budget is decisive, lean TUM; if you want the higher global brand, ETH.`;
  }

  return `That's a great question. Based on your profile — 3.84 GPA, IELTS 7.5, SAT 1520, targeting Computer Science — here's my take:

You're a competitive applicant for strong target schools and have a real shot at a couple of reaches. The biggest levers right now are your **essays** and a **second strong recommendation**, since your academics already clear the bar at most of your list.

Tell me a bit more about what you're optimizing for — prestige, cost, location or scholarships — and I'll give you a precise, personalized recommendation.`;
}
