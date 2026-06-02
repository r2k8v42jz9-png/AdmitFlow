#!/usr/bin/env node
/**
 * AdmitFlow — University ingestion pipeline.
 *
 * Bulk-imports universities (+ programs + deadlines) into Supabase. Designed to
 * scale to 50,000+ rows: streams the source, upserts in batches of 500, and is
 * idempotent (re-running updates rather than duplicates).
 *
 * USAGE
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/import-universities.mjs <source.json>
 *
 *   - <source.json> is an array of UniversityRecord (see SHAPE below). If
 *     omitted, it falls back to the bundled seed exported from the app catalog
 *     (scripts/seed/universities.seed.json) so you get a working dataset today.
 *   - Requires the SERVICE ROLE key (writes bypass RLS). Never ship this key
 *     to the client.
 *
 * SHAPE (UniversityRecord)
 *   {
 *     id, name, short_name, country, city, region, website, description,
 *     logo_url, qs_rank, the_rank, national_rank, acceptance_rate,
 *     tuition_min, tuition_max, currency, living_cost, student_count,
 *     intl_percent, languages[], degree_levels[], fields[], scholarships[],
 *     intl_support, requirements{}, programs[], deadlines[]
 *   }
 *
 * REAL DATA SOURCES (bring your own — licensing varies):
 *   - QS World University Rankings export (CSV/Excel) → map to this shape
 *   - THE Rankings dataset
 *   - Hipolabs Universities API (names/countries/domains, CC-licensed):
 *       https://github.com/Hipo/university-domains-list
 *   Convert any of these to the UniversityRecord array, then run this script.
 */

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("✖ Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (service role — not the publishable key).");
  process.exit(1);
}

const BATCH = 500;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function main() {
  const argPath = process.argv[2];
  const here = path.dirname(fileURLToPath(import.meta.url));
  const src = argPath ?? path.join(here, "seed", "universities.seed.json");

  console.log(`→ Reading source: ${src}`);
  const records = JSON.parse(await readFile(src, "utf8"));
  if (!Array.isArray(records)) throw new Error("Source must be a JSON array of universities.");
  console.log(`→ ${records.length} universities to ingest (batches of ${BATCH}).`);

  let universitiesUpserted = 0;
  let programsUpserted = 0;
  let deadlinesUpserted = 0;

  for (const [bi, batch] of chunk(records, BATCH).entries()) {
    // 1) Upsert the university rows.
    const uniRows = batch.map((r) => ({
      id: r.id,
      name: r.name,
      short_name: r.short_name ?? r.shortName ?? null,
      country: r.country,
      city: r.city ?? null,
      region: r.region ?? null,
      website: r.website ?? null,
      description: r.description ?? null,
      logo_url: r.logo_url ?? null,
      qs_rank: r.qs_rank ?? r.rankWorld ?? null,
      the_rank: r.the_rank ?? null,
      national_rank: r.national_rank ?? r.rankNational ?? null,
      acceptance_rate: r.acceptance_rate ?? r.acceptanceRate ?? null,
      tuition_min: r.tuition_min ?? r.tuitionPerYear ?? null,
      tuition_max: r.tuition_max ?? r.tuitionPerYear ?? null,
      currency: r.currency ?? "USD",
      living_cost: r.living_cost ?? r.livingCost ?? null,
      student_count: r.student_count ?? r.studentCount ?? null,
      intl_percent: r.intl_percent ?? r.intlPercent ?? null,
      languages: r.languages ?? ["English"],
      degree_levels: r.degree_levels ?? ["Bachelor", "Master"],
      fields: r.fields ?? r.tags ?? [],
      scholarships: r.scholarships ?? [],
      intl_support: r.intl_support ?? null,
      requirements: r.requirements ?? {},
    }));

    const { error: uErr } = await supabase.from("universities").upsert(uniRows, { onConflict: "id" });
    if (uErr) throw new Error(`universities batch ${bi}: ${uErr.message}`);
    universitiesUpserted += uniRows.length;

    // 2) Replace child rows for these universities (idempotent re-import).
    const ids = batch.map((r) => r.id);
    await supabase.from("university_programs").delete().in("university_id", ids);
    await supabase.from("university_deadlines").delete().in("university_id", ids);

    const progRows = batch.flatMap((r) =>
      (r.programs ?? []).map((p) => ({
        university_id: r.id,
        program_name: p.program_name ?? p.name,
        degree_level: p.degree_level ?? p.degree ?? null,
        field: p.field ?? null,
        duration: p.duration ?? null,
        language: p.language ?? null,
        tuition: p.tuition ?? p.tuitionPerYear ?? null,
        requirements: p.requirements ?? {},
      })),
    );
    if (progRows.length) {
      const { error } = await supabase.from("university_programs").insert(progRows);
      if (error) throw new Error(`programs batch ${bi}: ${error.message}`);
      programsUpserted += progRows.length;
    }

    const dlRows = batch.flatMap((r) =>
      (r.deadlines ?? []).map((d) => ({
        university_id: r.id,
        intake: d.intake ?? d.round ?? null,
        round: d.round ?? null,
        deadline_date: d.deadline_date ?? d.date ?? null,
      })),
    );
    if (dlRows.length) {
      const { error } = await supabase.from("university_deadlines").insert(dlRows);
      if (error) throw new Error(`deadlines batch ${bi}: ${error.message}`);
      deadlinesUpserted += dlRows.length;
    }

    console.log(`  ✓ batch ${bi + 1}: ${universitiesUpserted} universities so far`);
  }

  console.log("\n✅ Import complete");
  console.log(`   universities: ${universitiesUpserted}`);
  console.log(`   programs:     ${programsUpserted}`);
  console.log(`   deadlines:    ${deadlinesUpserted}`);
}

main().catch((e) => {
  console.error("✖ Import failed:", e.message);
  process.exit(1);
});
