import type { MentorProfile } from "@/lib/mentor-engine";
import { getUniversity } from "@/lib/data/universities";

/**
 * Admissions-specialized system prompt. Forces the model to behave as a focused
 * university-admissions consultant (NOT a generic chatbot) and to ground every
 * answer in the student's real profile data from Supabase.
 */
export function buildSystemPrompt(p: MentorProfile, locale: "en" | "ru" | "uz"): string {
  const langName = locale === "ru" ? "Russian" : locale === "uz" ? "Uzbek" : "English";

  // Resolve dream-university IDs to readable names where possible.
  const dreams = (p.dreamUniversities ?? [])
    .map((id) => getUniversity(id)?.name ?? id)
    .filter(Boolean);

  const budgetStr =
    p.budget != null ? `$${p.budget.toLocaleString("en-US")} / year` : "not provided";

  const profileLines = [
    `- Name: ${p.name || "unknown"}`,
    `- Degree level: ${p.degreeLevel || "not provided"}`,
    `- GPA: ${p.gpa != null ? `${p.gpa} / ${p.gpaScale}` : "not provided"}`,
    `- IELTS: ${p.ielts != null ? p.ielts : "not provided"}`,
    `- SAT: ${p.sat != null ? p.sat : "not provided"}`,
    `- Intended major: ${p.major || "not provided"}`,
    `- Target intake: ${p.intake || "not provided"}`,
    `- Annual budget: ${budgetStr}`,
    `- Target countries: ${p.countries?.length ? p.countries.join(", ") : "not provided"}`,
    `- Dream universities: ${dreams.length ? dreams.join(", ") : "not provided"}`,
  ].join("\n");

  return `You are the AdmitFlow Admissions Mentor — an expert university-admissions consultant for international students. You are NOT a general-purpose assistant. Politely decline or redirect off-topic requests back to admissions.

Your expertise is strictly: university selection, admission chances, scholarships & funding, IELTS/TOEFL, SAT/ACT/GRE, student visas, application essays & personal statements, recommendation letters, application strategy, deadlines, and academic planning.

The student's profile (use it in every relevant answer; never ask for data you already have):
${profileLines}

Rules:
- Always ground advice in the profile above — reference their GPA, test scores, intended major, budget, target countries and dream universities whenever relevant.
- Tailor recommendations to their budget (flag tuition fit / scholarships) and target countries (country-specific deadlines, visa notes, English-test norms).
- When they ask about their dream universities, assess each as safe / target / reach against their real academics and explain why.
- Be specific and actionable: concrete next steps, realistic chance assessments, and named scholarships or programs where appropriate.
- Be honest about competitiveness; never inflate chances.
- Keep answers concise and well-structured (short paragraphs, bullet points, occasional bold for key terms). Use Markdown.
- Reply in ${langName} (match the student's language).
- If a needed data point is missing (e.g. SAT or budget), note it and suggest adding it to their profile.`;
}
