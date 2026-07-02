-- ════════════════════════════════════════════════════════════════════════
-- AdmitFlow — Smart Match (V5)
-- Run the ENTIRE file in Supabase → SQL Editor → Run. Safe to re-run.
--
-- Adds a personalized match_universities() RPC: unlike search_universities()
-- (same result set for everyone), this scores every catalog row against the
-- CALLING user's own onboarding_data (gpa / ielts / intended_major) and their
-- excluded-countries list, returning a lightweight (id, score, classification)
-- result that the app hydrates to full University rows client-side.
-- ════════════════════════════════════════════════════════════════════════

-- ── onboarding_data.exclude_countries — Smart Match country filter ────────
alter table public.onboarding_data
  add column if not exists exclude_countries text[] not null default '{}';

-- ════════════════════════════════════════════════════════════════════════
-- match_universities() — personalized Fit Score + Safety/Target/Reach.
--
-- Deliberately takes NO client-supplied academic params (gpa/ielts/major/
-- excluded countries) — it reads onboarding_data for auth.uid() itself, so a
-- caller can't spoof a stronger profile than they actually have. Runs as
-- invoker (no `security definer`), same as search_universities(): RLS on
-- onboarding_data (`onboarding_rw_own`) already lets the owner select their
-- own row, and universities/university_programs are public-read (0002), so
-- no extra grants are needed.
--
-- Scoring (initial tuning — centralized here, easy to retune later):
--   gpaFit   = 50 + (userGpa/gpaScale*4 - reqGpa) * 40   [clamped 0-100]
--   ieltsFit = 50 + (userIelts - reqIelts) * 20           [clamped 0-100]
--   majorFit = pg_trgm similarity(intended_major, fields) scaled to 0-100
--              (pg_trgm is already enabled + indexed by 0002 — reused, not
--              a new extension)
--   rankFit  = same rank-based curve as deriveFitScore() in
--              src/lib/supabase/university-map.ts, at low weight
--   matchScore = round(0.35*gpaFit + 0.25*ieltsFit + 0.25*majorFit + 0.15*rankFit)
--   classification:
--     'reach'  if matchScore < 45
--     'safety' if matchScore >= 70 and (acceptance_rate is null or >= 30)
--     'target' otherwise
--   (boundaries line up with admissionBand()'s existing 35/65 cut points in
--   src/components/universities/university-card.tsx)
--
-- Any missing input (no onboarding row, null gpa/ielts/major, no stated
-- requirement, no fields on a university) maps to a neutral 60 sub-score
-- rather than penalizing an incomplete profile or catalog gap.
-- ════════════════════════════════════════════════════════════════════════
create or replace function public.match_universities(
  p_limit  integer default 60,
  p_offset integer default 0
)
returns table (
  university_id  text,
  match_score    integer,
  classification text
)
language plpgsql stable as $$
declare
  v_uid           uuid := auth.uid();
  v_gpa           numeric;
  v_gpa_scale     numeric;
  v_ielts         numeric;
  v_major         text;
  v_exclude       text[];
begin
  if v_uid is null then
    return;
  end if;

  select o.gpa, coalesce(o.gpa_scale, 4.0), o.ielts, o.intended_major, coalesce(o.exclude_countries, '{}')
    into v_gpa, v_gpa_scale, v_ielts, v_major, v_exclude
  from public.onboarding_data o
  where o.user_id = v_uid;

  -- No onboarding row yet → nothing to personalize against.
  if not found then
    return;
  end if;

  return query
  select
    u.id,
    scored.match_score,
    (case
       when scored.match_score < 45 then 'reach'
       when scored.match_score >= 70 and (u.acceptance_rate is null or u.acceptance_rate >= 30) then 'safety'
       else 'target'
     end)::text as classification
  from public.universities u
  cross join lateral (
    select
      -- gpaFit
      (case
         when v_gpa is null or (u.requirements ->> 'gpa') is null then 60
         else greatest(0, least(100, round(
           50 + ((v_gpa / nullif(v_gpa_scale, 0) * 4.0) - (u.requirements ->> 'gpa')::numeric) * 40
         )))
       end) as gpa_fit,
      -- ieltsFit
      (case
         when v_ielts is null or (u.requirements ->> 'ielts') is null then 60
         else greatest(0, least(100, round(
           50 + (v_ielts - (u.requirements ->> 'ielts')::numeric) * 20
         )))
       end) as ielts_fit,
      -- majorFit (pg_trgm similarity vs fields[])
      (case
         when v_major is null or v_major = '' or u.fields is null or array_length(u.fields, 1) is null then 60
         else greatest(0, least(100, round(
           (select coalesce(max(similarity(lower(f), lower(v_major))), 0) from unnest(u.fields) f) * 140
         )))
       end) as major_fit,
      -- rankFit (mirrors deriveFitScore in university-map.ts)
      greatest(30, least(99, round(100 - coalesce(u.qs_rank, 800) / 12.0))) as rank_fit
  ) fits
  cross join lateral (
    select round(0.35 * fits.gpa_fit + 0.25 * fits.ielts_fit + 0.25 * fits.major_fit + 0.15 * fits.rank_fit)::integer as match_score
  ) scored
  where not (u.country = any(v_exclude))
  order by scored.match_score desc, u.name asc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
end;
$$;
