/**
 * Generates scripts/seed/universities.seed.json from the app's existing
 * catalog (src/lib/data/universities.ts), in the ingestion UniversityRecord
 * shape. Run with: npx tsx scripts/build-seed.ts
 *
 * Keeps the seed in lockstep with the in-app catalog, so the DB import and the
 * pre-migration fallback show identical data.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { universities } from "../src/lib/data/universities";

const records = universities.map((u) => ({
  id: u.id,
  name: u.name,
  short_name: u.shortName,
  country: u.country,
  city: u.city,
  region: null,
  website: u.website ?? null,
  description: u.blurb ?? null,
  logo_url: null,
  qs_rank: u.rankWorld ?? null,
  the_rank: null,
  national_rank: u.rankNational ?? null,
  acceptance_rate: u.acceptanceRate ?? null,
  tuition_min: u.tuitionPerYear ?? null,
  tuition_max: u.tuitionPerYear ?? null,
  currency: u.currency ?? "USD",
  living_cost: u.livingCost ?? null,
  student_count: u.studentCount ?? null,
  intl_percent: u.intlPercent ?? null,
  languages: ["English"],
  degree_levels: [...new Set((u.programs ?? []).map((p) => p.degree))].filter(Boolean),
  fields: u.tags ?? [],
  scholarships: u.scholarships ?? [],
  intl_support: null,
  requirements: u.requirements ?? {},
  programs: (u.programs ?? []).map((p) => ({
    program_name: p.name,
    degree_level: p.degree,
    duration: p.duration,
    tuition: p.tuitionPerYear,
  })),
  deadlines: (u.deadlines ?? []).map((d) => ({ intake: d.round, round: d.round, deadline_date: d.date })),
}));

async function main() {
  const out = path.join(process.cwd(), "scripts", "seed", "universities.seed.json");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(records, null, 2));
  console.log(`✓ Wrote ${records.length} universities to ${out}`);
}

main();
