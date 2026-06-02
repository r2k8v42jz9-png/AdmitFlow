-- ════════════════════════════════════════════════════════════════════════
-- AdmitFlow — Global University Catalog (V4)
-- Run the ENTIRE file in Supabase → SQL Editor → Run. Safe to re-run.
--
-- Scalable to 50,000+ universities: normalized tables, GIN full-text search,
-- btree indexes on every filter column, and a public (read-only) catalog with
-- a per-user saved-list relation protected by RLS.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists pg_trgm;   -- fuzzy name/city matching

-- ── universities ──────────────────────────────────────────────────────────
create table if not exists public.universities (
  id              text primary key,                 -- stable slug, e.g. 'mit'
  name            text not null,
  short_name      text,
  country         text not null,
  city            text,
  region          text,                              -- e.g. 'North America', 'EU'
  website         text,
  description     text,
  logo_url        text,
  qs_rank         integer,
  the_rank        integer,
  national_rank   integer,
  acceptance_rate numeric(5, 2),                     -- percent
  tuition_min     integer,                           -- per year, in `currency`
  tuition_max     integer,
  currency        text default 'USD',
  living_cost     integer,
  student_count   integer,
  intl_percent    numeric(5, 2),
  languages       text[] not null default '{}',      -- languages of instruction
  degree_levels   text[] not null default '{}',      -- Bachelor / Master / PhD
  fields          text[] not null default '{}',      -- fields of study (tags)
  scholarships    jsonb  not null default '[]'::jsonb,
  intl_support    text,                              -- international student support notes
  requirements    jsonb  not null default '{}'::jsonb, -- { gpa, ielts, sat, gre, essays, recommendations }
  -- Full-text search vector over the most-searched columns. Maintained by the
  -- universities_search_tsv trigger below (a GENERATED column can't be used:
  -- to_tsvector('simple', …) is only STABLE, not IMMUTABLE, so Postgres rejects
  -- it in a generation expression — "generation expression is not immutable").
  search_tsv      tsvector,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── university_programs ───────────────────────────────────────────────────
create table if not exists public.university_programs (
  id            bigint generated always as identity primary key,
  university_id text not null references public.universities (id) on delete cascade,
  program_name  text not null,
  degree_level  text,                                -- Bachelor / Master / PhD
  field         text,
  duration      text,
  language      text,
  tuition       integer,
  requirements  jsonb default '{}'::jsonb
);

-- ── university_deadlines ──────────────────────────────────────────────────
create table if not exists public.university_deadlines (
  id            bigint generated always as identity primary key,
  university_id text not null references public.universities (id) on delete cascade,
  intake        text,                                -- 'Fall 2027', 'Early Action', ...
  round         text,
  deadline_date date
);

-- ── user_universities (saved lists / target builder) ──────────────────────
create table if not exists public.user_universities (
  user_id       uuid not null references auth.users (id) on delete cascade,
  university_id text not null references public.universities (id) on delete cascade,
  category      text not null default 'target',      -- 'dream' | 'target' | 'safety'
  status        text not null default 'considering', -- considering | applying | submitted | accepted | rejected
  notes         text,
  created_at    timestamptz not null default now(),
  primary key (user_id, university_id)
);

-- ── Indexes (every filter column + FTS + fuzzy) ───────────────────────────
create index if not exists idx_uni_search        on public.universities using gin (search_tsv);
create index if not exists idx_uni_name_trgm      on public.universities using gin (name gin_trgm_ops);
create index if not exists idx_uni_country        on public.universities (country);
create index if not exists idx_uni_qs_rank        on public.universities (qs_rank);
create index if not exists idx_uni_the_rank       on public.universities (the_rank);
create index if not exists idx_uni_tuition        on public.universities (tuition_min);
create index if not exists idx_uni_acceptance     on public.universities (acceptance_rate);
create index if not exists idx_uni_fields         on public.universities using gin (fields);
create index if not exists idx_uni_degrees        on public.universities using gin (degree_levels);
create index if not exists idx_prog_university    on public.university_programs (university_id);
create index if not exists idx_prog_field         on public.university_programs (field);
create index if not exists idx_deadline_university on public.university_deadlines (university_id);
create index if not exists idx_userunis_user      on public.user_universities (user_id);
create index if not exists idx_userunis_category   on public.user_universities (user_id, category);

-- Defensive: ensure the column exists even if an older/partial run created the
-- table without it (keeps this migration safe to re-run across versions).
alter table public.universities add column if not exists search_tsv tsvector;

-- ── Full-text search vector — maintained by trigger (NOT a generated column) ─
-- to_tsvector('simple', …) is STABLE (the text→regconfig cast does a catalog
-- lookup), so it can't live in a GENERATED column. A trigger has no such
-- restriction and produces an identical, index-backed search_tsv.
create or replace function public.universities_search_tsv_update()
returns trigger
language plpgsql as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.short_name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.country, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.city, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(new.fields, ' ')), 'C');
  return new;
end;
$$;

drop trigger if exists universities_search_tsv on public.universities;
create trigger universities_search_tsv
  before insert or update of name, short_name, country, city, fields
  on public.universities
  for each row execute function public.universities_search_tsv_update();

-- Backfill any rows already present (no-op on a fresh database). Touching a
-- watched column (name = name) fires the trigger above to compute search_tsv.
update public.universities set name = name where search_tsv is null;

-- updated_at trigger (reuses set_updated_at from 0001)
drop trigger if exists universities_set_updated_at on public.universities;
create trigger universities_set_updated_at before update on public.universities
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- Catalog tables: PUBLIC READ (anyone can browse), writes restricted to
-- service-role (ingestion). user_universities: strictly own-row.
-- ════════════════════════════════════════════════════════════════════════
alter table public.universities        enable row level security;
alter table public.university_programs  enable row level security;
alter table public.university_deadlines enable row level security;
alter table public.user_universities    enable row level security;

drop policy if exists "uni_public_read" on public.universities;
create policy "uni_public_read" on public.universities for select using (true);

drop policy if exists "prog_public_read" on public.university_programs;
create policy "prog_public_read" on public.university_programs for select using (true);

drop policy if exists "deadline_public_read" on public.university_deadlines;
create policy "deadline_public_read" on public.university_deadlines for select using (true);

-- (No insert/update/delete policies on catalog tables → only the service-role
--  key bypasses RLS for ingestion. End users can never mutate the catalog.)

drop policy if exists "userunis_rw_own" on public.user_universities;
create policy "userunis_rw_own" on public.user_universities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════
-- search_universities() — one RPC powering the explorer's filters + FTS,
-- with server-side ranking and pagination (fast at 50k+ rows).
-- ════════════════════════════════════════════════════════════════════════
create or replace function public.search_universities(
  q              text default null,
  p_country      text default null,
  p_field        text default null,
  p_degree       text default null,
  max_tuition    integer default null,
  max_qs_rank    integer default null,
  needs_scholarship boolean default false,
  p_limit        integer default 24,
  p_offset       integer default 0
)
returns setof public.universities
language sql stable as $$
  select *
  from public.universities u
  where (q is null or q = '' or u.search_tsv @@ websearch_to_tsquery('simple', q) or u.name ilike '%' || q || '%')
    and (p_country is null or u.country = p_country)
    and (p_field   is null or p_field = any(u.fields))
    and (p_degree  is null or p_degree = any(u.degree_levels))
    and (max_tuition is null or coalesce(u.tuition_min, 0) <= max_tuition)
    and (max_qs_rank is null or (u.qs_rank is not null and u.qs_rank <= max_qs_rank))
    and (needs_scholarship = false or jsonb_array_length(u.scholarships) > 0)
  order by coalesce(u.qs_rank, 999999) asc, u.name asc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;
