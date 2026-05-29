import type { OnboardingData } from "@/lib/user-store";
import type { RoadmapMilestone, RoadmapTask, University } from "@/lib/types";

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

function computeStatuses(windows: [Date, Date][]): RoadmapMilestone["status"][] {
  const today = FROZEN_TODAY.getTime();
  let activeAssigned = false;
  const res: RoadmapMilestone["status"][] = windows.map(([s, e]) => {
    if (e.getTime() < today) return "done";
    if (!activeAssigned && s.getTime() <= today) {
      activeAssigned = true;
      return "active";
    }
    return "upcoming";
  });
  if (!res.includes("active")) {
    const firstUpcoming = res.indexOf("upcoming");
    res[firstUpcoming !== -1 ? firstUpcoming : res.length - 1] = "active";
  }
  return res;
}

/**
 * Generates a personalized roadmap from a user's onboarding profile.
 * Tasks, milestones and deadlines vary by GPA, IELTS/SAT, degree level,
 * intended intake and target countries — so every profile yields a
 * different plan.
 */
export function generateRoadmap(onboarding: OnboardingData | null): RoadmapMilestone[] {
  const o = onboarding ?? DEFAULT_ONBOARDING;
  const intake = parseIntake(o.targetIntake);

  const degree = o.degreeLevel || "Bachelor's";
  const isBachelor = /bachelor/i.test(degree);
  const isMaster = /master/i.test(degree);
  const isPhD = /phd|doctor/i.test(degree);

  const gpaRatio = o.gpa != null && o.gpaScale ? o.gpa / o.gpaScale : null;
  const countries = o.countries ?? [];
  const country = countries[0];
  const targetCount = Math.max(o.dreamUniversities?.length ?? 0, 6);

  const earlyDeadline = addMonths(intake, -10);

  const windows: [Date, Date][] = [
    [addMonths(intake, -18), addMonths(intake, -12)],
    [addMonths(intake, -12), addMonths(intake, -9)],
    [addMonths(intake, -9), addMonths(intake, -6)],
    [addMonths(intake, -6), addMonths(intake, -3)],
    [addMonths(intake, -3), intake],
  ];
  const statuses = computeStatuses(windows);
  const windowLabel = (i: number) => `${monthYear.format(windows[i][0])} – ${monthYear.format(windows[i][1])}`;

  /* ---- Milestone 1: Foundation & tests ---- */
  const m1: RoadmapTask[] = [];
  if (o.ielts == null) {
    m1.push({ id: "m1-ielts", label: "Register for and take IELTS (target 7.0)", done: false });
  } else if (o.ielts < 6.5) {
    m1.push({ id: "m1-ielts", label: `Retake IELTS to reach 7.0+ (current ${o.ielts})`, done: false });
  } else {
    m1.push({ id: "m1-ielts", label: `IELTS achieved — band ${o.ielts}`, done: true });
  }
  if (isBachelor) {
    m1.push(
      o.sat == null
        ? { id: "m1-sat", label: "Take the SAT (target 1450+)", done: false }
        : { id: "m1-sat", label: `SAT achieved — ${o.sat}`, done: true },
    );
  }
  if (isMaster || isPhD) {
    m1.push({ id: "m1-gre", label: "Take the GRE (target 320+)", done: false });
  }
  if (gpaRatio != null && gpaRatio < 0.85) {
    m1.push({ id: "m1-gpa", label: `Strengthen GPA — currently ${o.gpa}/${o.gpaScale}`, done: false });
  } else if (gpaRatio != null) {
    m1.push({ id: "m1-gpa", label: `Maintain strong GPA (${o.gpa}/${o.gpaScale})`, done: true });
  } else {
    m1.push({ id: "m1-gpa", label: "Add your GPA to your academic profile", done: false });
  }
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

  /* ---- Milestone 4: Submit applications ---- */
  const m4: RoadmapTask[] = [
    { id: "m4-early", label: `Submit early-round applications (by ${fullDate.format(earlyDeadline)})`, done: false },
    { id: "m4-scholar", label: "Apply for scholarships you qualify for", done: false },
  ];
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
    const status = statuses[i];
    return {
      ...m,
      status,
      window: windowLabel(i),
      // A completed phase implies its tasks are done.
      tasks: status === "done" ? m.tasks.map((t) => ({ ...t, done: true })) : m.tasks,
    };
  });
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
