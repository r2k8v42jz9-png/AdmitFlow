# University catalog — schema, seed & ingestion

A scalable global university catalog for AdmitFlow (designed for 50,000+ rows).

## 1. Create the schema
Run `supabase/migrations/0002_universities.sql` in the Supabase SQL editor. It creates:
- `universities` (catalog) — FTS `tsvector`, trigram name index, btree on every filter column
- `university_programs`, `university_deadlines` — normalized children (cascade delete)
- `user_universities` — per-user saved list with `category` (dream/target/safety) + RLS
- `search_universities(...)` RPC — server-side FTS + ranking/tuition/country/degree/scholarship filters + pagination

Catalog tables are **public-read**; only the service-role key can write them (ingestion). `user_universities` is strictly own-row.

## 2. Build the seed (from the in-app catalog)
```bash
npx tsx scripts/build-seed.ts        # → scripts/seed/universities.seed.json (61 unis, 25 countries)
```

## 3. Import into Supabase
```bash
SUPABASE_URL=https://YOUR.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \
  node scripts/import-universities.mjs            # uses the bundled seed
# or with your own dataset:
  node scripts/import-universities.mjs path/to/universities.json
```
- Upserts in batches of 500, idempotent (re-run = update). Scales to 50k+.
- **Service-role key required** (writes bypass RLS). Never expose it client-side.

## 4. Scaling to real Top-500 / 10k+ data
Convert any source into the `UniversityRecord[]` shape (see header of
`import-universities.mjs`) and pass its path to the import script. Suggested sources:
- QS / THE ranking exports (CSV → JSON)
- Hipolabs `university-domains-list` (CC-licensed names/countries/domains)

The app reads the catalog through `src/lib/supabase/universities.ts`, which calls
the `search_universities` RPC and **falls back to the bundled in-app catalog**
until the table is populated — so the explorer works before and after import.
