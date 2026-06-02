import type { Program, University } from "@/lib/types";

/**
 * Pure mappers from Supabase `universities` rows (and embedded
 * `university_programs` / `university_deadlines`) to the app's `University`
 * shape. No React / no "use client" — safe to import from both client and
 * server data layers.
 */

type Row = Record<string, unknown>;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Derived display "AI fit" from world rank (DB has no fit column). */
function deriveFitScore(qsRank: number | null): number {
  const r = qsRank ?? 800;
  return clamp(Math.round(100 - r / 12), 30, 99);
}

/** Admission probability: real acceptance rate when present, else rank-based. */
function deriveAdmissionProbability(acceptance: number | null, qsRank: number | null): number {
  if (acceptance != null && acceptance > 0) return clamp(Math.round(acceptance), 1, 99);
  const r = qsRank ?? 800;
  return clamp(Math.round(r / 10), 3, 90);
}

function mapProgram(p: Row): Program {
  const degree = String(p.degree_level ?? "Bachelor");
  const normalized: Program["degree"] =
    degree === "Master" || degree === "PhD" ? degree : "Bachelor";
  return {
    name: String(p.program_name ?? ""),
    degree: normalized,
    duration: (p.duration as string) ?? "",
    tuitionPerYear: (p.tuition as number) ?? 0,
  };
}

function mapDeadline(d: Row): { round: string; date: string } {
  return {
    round: (d.round as string) ?? (d.intake as string) ?? "",
    date: (d.deadline_date as string) ?? "",
  };
}

/** Maps a DB universities row (optionally with embedded programs/deadlines). */
export function rowToUniversity(r: Row): University {
  const reqs = (r.requirements ?? {}) as Record<string, number>;
  const qsRank = (r.qs_rank as number) ?? null;
  const acceptance = (r.acceptance_rate as number) ?? null;
  const programs = Array.isArray(r.university_programs)
    ? (r.university_programs as Row[]).map(mapProgram)
    : [];
  const deadlines = Array.isArray(r.university_deadlines)
    ? (r.university_deadlines as Row[]).map(mapDeadline)
    : [];

  return {
    id: String(r.id),
    name: String(r.name),
    shortName: (r.short_name as string) ?? String(r.name),
    country: String(r.country),
    city: (r.city as string) ?? "",
    flag: "🏳️",
    logoColor: "#1d4ed8",
    rankWorld: qsRank ?? 9999,
    rankNational: (r.national_rank as number) ?? 0,
    acceptanceRate: acceptance ?? 0,
    tuitionPerYear: (r.tuition_min as number) ?? 0,
    currency: (r.currency as string) ?? "USD",
    livingCost: (r.living_cost as number) ?? 0,
    studentCount: (r.student_count as number) ?? 0,
    intlPercent: (r.intl_percent as number) ?? 0,
    fitScore: deriveFitScore(qsRank),
    admissionProbability: deriveAdmissionProbability(acceptance, qsRank),
    tags: (r.fields as string[]) ?? [],
    requirements: {
      gpa: reqs.gpa ?? 0,
      ielts: reqs.ielts ?? 0,
      sat: reqs.sat,
      gre: reqs.gre,
      essays: reqs.essays ?? 0,
      recommendations: reqs.recommendations ?? 0,
    },
    deadlines,
    programs,
    scholarships: (r.scholarships as University["scholarships"]) ?? [],
    highlights: [],
    aiInsight: "",
    blurb: (r.description as string) ?? "",
    accent: "from-blue-500/25 to-indigo-500/10",
    website: (r.website as string) ?? undefined,
  };
}
