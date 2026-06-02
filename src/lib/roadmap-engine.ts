import type { OnboardingData } from "@/lib/user-store";
import type { RoadmapMilestone, RoadmapTask, University } from "@/lib/types";
import { getUniversity } from "@/lib/data/universities";

/** Frozen "today" — keeps generated windows deterministic across SSR/CSR. */
const FROZEN_TODAY = new Date("2026-05-29T00:00:00");

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const DEFAULT_ONBOARDING: OnboardingData = {
  degreeLevel: "Bachelor's",
  intendedMajor: "your field",
  gpa: null,
  gpaScale: 4,
  ielts: null,
  sat: null,
  countries: [],
  budget: null,
  strengths: [],
  dreamUniversities: [],
  targetIntake: "Fall 2027",
};

function parseIntake(intake: string): Date {
  const m = /(Fall|Spring|Summer|Winter)\s+(\d{4})/i.exec(intake ?? "");
  const year = m ? parseInt(m[2], 10) : FROZEN_TODAY.getFullYear() + 1;
  const season = (m ? m[1] : "Fall").toLowerCase();
  // Approx intake start month: Spring→Feb, Summer→Jul, Winter→Jan, Fall→Sep
  const month = season === "spring" ? 1 : season === "summer" ? 6 : season === "winter" ? 0 : 8;
  return new Date(year, month, 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function visaFor(country?: string): string {
  switch (country) {
    case "United States":
      return "F-1 visa";
    case "United Kingdom":
      return "UK Student visa";
    case "Canada":
      return "study permit";
    case "Australia":
      return "subclass 500";
    case "Germany":
      return "national visa";
    default:
      return "student visa";
  }
}

/**
 * Generates a personalized roadmap from a user's onboarding profile and their
 * SAVED target universities. Tasks, milestones and deadlines vary by GPA,
 * IELTS/SAT, degree level, intended intake, target countries and the specific
 * schools the user has saved — so every profile yields a different plan, and
 * the plan updates whenever a university is added or removed.
 *
 * `savedUniversityIds` come from the `user_universities`-backed store (NOT from
 * onboarding.dreamUniversities). Their details are resolved against the local
 * catalog as a temporary fallback until the DB catalog is the live source.
 */
export function generateRoadmap(
  onboarding: OnboardingData | null,
  savedUniversityIds: string[] = [],
): RoadmapMilestone[] {
  const o = onboarding ?? DEFAULT_ONBOARDING;
  const intake = parseIntake(o.targetIntake);

  const degree = o.degreeLevel || "Bachelor's";
  const isBachelor = /bachelor/i.test(degree);
  const isMaster = /master/i.test(degree);
  const isPhD = /phd|doctor/i.test(degree);

  const gpaRatio = o.gpa != null && o.gpaScale ? o.gpa / o.gpaScale : null;
  const countries = o.countries ?? [];
  const country = countries[0];

  // Resolve the user's SAVED universities so the roadmap reflects their real
  // targets — their deadlines and requirements shape the plan (not a template).
  // Source = the user_universities-backed store, resolved via the local catalog.
  const selected = savedUniversityIds
    .map((id) => getUniversity(id))
    .filter((u): u is University => !!u);
  const targetCount = Math.max(selected.length, 6);

  // Toughest test bar across selected schools → drives the test-prep milestone.
  const maxReqIelts = selected.reduce((m, u) => Math.max(m, u.requirements.ielts ?? 0), 0);
  const maxReqSat = selected.reduce((m, u) => Math.max(m, u.requirements.sat ?? 0), 0);

  const earlyDeadline = addMonths(intake, -10);

  const windows: [Date, Date][] = [
    [addMonths(intake, -18), addMonths(intake, -12)],
    [addMonths(intake, -12), addMonths(intake, -9)],
    [addMonths(intake, -9), addMonths(intake, -6)],
    [addMonths(intake, -6), addMonths(intake, -3)],
    [addMonths(intake, -3), intake],
  ];
  const windowLabel = (i: number) => `${monthYear.format(windows[i][0])} – ${monthYear.format(windows[i][1])}`;

  /* ---- Milestone 1: Foundation & tests ----
     Completion is driven STRICTLY by data that exists in the user's profile.
     A task is `done` only when the corresponding record is present (e.g. an
     IELTS/SAT score). Action items with no backing record stay `false`. */
  // Test targets reflect the toughest requirement among the SELECTED schools.
  const ieltsTarget = maxReqIelts > 0 ? maxReqIelts.toFixed(1) : "7.0";
  const satTarget = maxReqSat > 0 ? `${maxReqSat}` : "1450+";

  const m1: RoadmapTask[] = [];
  // IELTS: done only if a score exists in the profile.
  m1.push(
    o.ielts != null
      ? { id: "m1-ielts", label: `IELTS recorded — band ${o.ielts}`, done: true }
      : { id: "m1-ielts", label: `Register for and take IELTS (target ${ieltsTarget} for your schools)`, done: false },
  );
  if (isBachelor) {
    // SAT: done only if a score exists.
    m1.push(
      o.sat != null
        ? { id: "m1-sat", label: `SAT recorded — ${o.sat}`, done: true }
        : { id: "m1-sat", label: `Take the SAT (target ${satTarget} for your schools)`, done: false },
    );
  }
  if (isMaster || isPhD) {
    // GRE: no GRE field in the profile → never auto-completed.
    m1.push({ id: "m1-gre", label: "Take the GRE (target 320+)", done: false });
  }
  // GPA: done only if a GPA value exists (the data point is recorded).
  m1.push(
    gpaRatio != null
      ? { id: "m1-gpa", label: `GPA recorded — ${o.gpa}/${o.gpaScale}`, done: true }
      : { id: "m1-gpa", label: "Add your GPA to your academic profile", done: false },
  );
  // Transcript: no document store → never auto-completed.
  m1.push({ id: "m1-docs", label: "Translate & notarize academic transcripts", done: false });

  /* ---- Milestone 2: Shortlist universities ---- */
  const m2: RoadmapTask[] = [
    { id: "m2-list", label: `Finalize a balanced list of ${targetCount} universities (reach / target / safety)`, done: false },
  ];
  if (countries.length) {
    const shown = countries.slice(0, 3).join(", ");
    const extra = countries.length > 3 ? ` +${countries.length - 3} more` : "";
    m2.push({ id: "m2-research", label: `Research entry requirements for ${shown}${extra}`, done: false });
  } else {
    m2.push({ id: "m2-research", label: "Pick your target countries and study their requirements", done: false });
  }
  m2.push({ id: "m2-compare", label: "Compare tuition, scholarships and living costs", done: false });
  m2.push({ id: "m2-prob", label: "Run admission probability for each target", done: false });

  /* ---- Milestone 3: Essays & recommendations ---- */
  const m3: RoadmapTask[] = [];
  if (isMaster) {
    m3.push({ id: "m3-sop", label: "Write your statement of purpose (SOP)", done: false });
    m3.push({ id: "m3-cv", label: "Prepare your academic CV", done: false });
  } else if (isPhD) {
    m3.push({ id: "m3-proposal", label: "Draft your research proposal", done: false });
    m3.push({ id: "m3-supervisors", label: "Email 2–3 potential supervisors", done: false });
  } else {
    m3.push({ id: "m3-ps", label: "Draft your personal statement", done: false });
  }
  m3.push({ id: "m3-rec", label: "Request 2 recommendation letters", done: false });
  m3.push({ id: "m3-ai", label: "Get AI feedback on your essays and revise", done: false });
  if (countries.includes("United States")) {
    m3.push({ id: "m3-commonapp", label: "Complete Common App supplemental essays", done: false });
  }
  if (countries.includes("United Kingdom")) {
    m3.push({ id: "m3-ucas", label: "Finalize your UCAS personal statement", done: false });
  }

  /* ---- Milestone 4: Submit applications ----
     One concrete task PER SELECTED SCHOOL, using that school's earliest real
     deadline — so e.g. picking Harvard + UCL produces their actual dates. */
  const m4: RoadmapTask[] = [];
  for (const u of selected.slice(0, 8)) {
    const earliest = [...(u.deadlines ?? [])]
      .map((d) => d.date)
      .filter(Boolean)
      .sort()[0];
    const when = earliest ? ` (by ${fullDate.format(new Date(earliest))})` : "";
    m4.push({ id: `m4-app-${u.id}`, label: `Submit your ${u.shortName} application${when}`, done: false });
  }
  if (m4.length === 0) {
    m4.push({ id: "m4-early", label: `Submit early-round applications (by ${fullDate.format(earlyDeadline)})`, done: false });
  }
  m4.push({ id: "m4-scholar", label: "Apply for scholarships you qualify for", done: false });
  if (countries.includes("Germany")) {
    m4.push({ id: "m4-aps", label: "Submit via uni-assist / complete your APS certificate", done: false });
  }
  m4.push({ id: "m4-interview", label: "Prepare for admissions interviews", done: false });

  /* ---- Milestone 5: Decisions & visa ---- */
  const m5: RoadmapTask[] = [
    { id: "m5-compare", label: "Compare admission offers and funding packages", done: false },
    { id: "m5-accept", label: "Accept your best-fit offer & pay the deposit", done: false },
    { id: "m5-visa", label: `Apply for your ${visaFor(country)}`, done: false },
    { id: "m5-housing", label: "Arrange housing, insurance and travel", done: false },
  ];

  const milestones: Omit<RoadmapMilestone, "status" | "window">[] = [
    { id: "m-1", title: "Foundation & tests", icon: "GraduationCap", description: "Lock in academics, sit standardized tests and prepare your documents.", tasks: m1 },
    { id: "m-2", title: "Shortlist universities", icon: "Telescope", description: "Build a balanced list with AI fit analysis across your target countries.", tasks: m2 },
    { id: "m-3", title: "Essays & recommendations", icon: "PenLine", description: "Draft, refine and get AI feedback on essays; secure your recommenders.", tasks: m3 },
    { id: "m-4", title: "Submit applications", icon: "Send", description: "Submit each application before its deadline and confirm receipt.", tasks: m4 },
    { id: "m-5", title: "Decisions & visa", icon: "PartyPopper", description: "Compare offers, accept the best fit and complete visa and housing.", tasks: m5 },
  ];

  return milestones.map((m, i) => {
    // Milestone status reflects ACTUAL task completion, not the calendar window:
    //   all tasks done → "done"; some done OR it's the earliest unfinished
    //   phase → "active"; otherwise "upcoming".
    const doneCount = m.tasks.filter((t) => t.done).length;
    const allDone = m.tasks.length > 0 && doneCount === m.tasks.length;
    let status: RoadmapMilestone["status"];
    if (allDone) status = "done";
    else if (doneCount > 0 || i === firstUnfinished(milestones)) status = "active";
    else status = "upcoming";

    return { ...m, status, window: windowLabel(i), tasks: m.tasks };
  });
}

/** Index of the earliest milestone that isn't fully complete (for "active"). */
function firstUnfinished(milestones: { tasks: RoadmapTask[] }[]): number {
  const idx = milestones.findIndex(
    (m) => m.tasks.length === 0 || m.tasks.some((t) => !t.done),
  );
  return idx === -1 ? 0 : idx;
}

/** Suggested next universities to add, biased to the user's target countries. */
export function recommendForProfile(o: OnboardingData | null, pool: University[], limit = 3): University[] {
  const countries = o?.countries ?? [];
  const ranked = [...pool].sort((a, b) => {
    const aMatch = countries.includes(a.country) ? 1 : 0;
    const bMatch = countries.includes(b.country) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return b.fitScore - a.fitScore;
  });
  return ranked.slice(0, limit);
}
