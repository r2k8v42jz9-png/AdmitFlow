-- ════════════════════════════════════════════════════════════════════════
-- AdmitFlow — complete database schema (V3)
-- Run the ENTIRE file in Supabase → SQL Editor → Run.
--
-- Safe to re-run (idempotent). Fixes a half-applied state where the
-- handle_new_user trigger exists but its target tables do not (which breaks
-- signup with "Database error saving new user").
--
-- Five tables, each 1:1 with auth.users(id), all protected by RLS.
-- ════════════════════════════════════════════════════════════════════════

-- 0) Remove the orphaned trigger first so signups can't fail mid-migration ------
drop trigger if exists on_auth_user_created on auth.users;

-- Shared helper: keep updated_at fresh -----------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── 1) profiles — identity + language ─────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  language    text not null default 'ru',            -- 'ru' | 'uz' | 'en' (Russian default)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── 2) onboarding_data — academic profile ─────────────────────────────────────
create table if not exists public.onboarding_data (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  degree_level       text,
  intended_major     text,
  gpa                numeric(4, 2),
  gpa_scale          numeric(3, 1) default 4.0,
  ielts              numeric(3, 1),
  sat                integer,
  budget             integer,
  countries          text[] not null default '{}',
  strengths          text[] not null default '{}',
  dream_universities text[] not null default '{}',
  target_intake      text,
  career_goals       text,
  completed          boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ── 3) subscriptions — plan + billing status ──────────────────────────────────
create table if not exists public.subscriptions (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  plan               text,                                   -- 'starter' | 'pro' | 'premium'
  status             text not null default 'inactive',       -- 'inactive' | 'active' | 'past_due' | 'canceled'
  provider           text,                                   -- 'stripe' | 'payme' | 'click' | 'octo' | 'payze' | 'mock'
  current_period_end timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ── 4) user_progress — roadmap progress ───────────────────────────────────────
create table if not exists public.user_progress (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  roadmap_overrides jsonb  not null default '{}'::jsonb,      -- { "<taskId>": boolean }
  completed_tasks   text[] not null default '{}',
  updated_at        timestamptz not null default now()
);

-- ── 5) streaks — daily return streak ──────────────────────────────────────────
create table if not exists public.streaks (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  count       integer not null default 0,
  last_visit  date,
  updated_at  timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- (PK on user_id/id already covers per-user lookups; these support admin/analytics.)
create index if not exists idx_profiles_email          on public.profiles (email);
create index if not exists idx_profiles_language        on public.profiles (language);
create index if not exists idx_onboarding_completed     on public.onboarding_data (completed);
create index if not exists idx_subscriptions_status     on public.subscriptions (status);
create index if not exists idx_subscriptions_plan       on public.subscriptions (plan);
create index if not exists idx_streaks_last_visit       on public.streaks (last_visit);

-- ── updated_at triggers ────────────────────────────────────────────────────────
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists onboarding_set_updated_at on public.onboarding_data;
create trigger onboarding_set_updated_at before update on public.onboarding_data
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

drop trigger if exists streaks_set_updated_at on public.streaks;
create trigger streaks_set_updated_at before update on public.streaks
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════════
-- Row Level Security — a user can only read/write their own rows
-- ════════════════════════════════════════════════════════════════════════
alter table public.profiles        enable row level security;
alter table public.onboarding_data enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.user_progress   enable row level security;
alter table public.streaks         enable row level security;

drop policy if exists "profiles_rw_own" on public.profiles;
create policy "profiles_rw_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "onboarding_rw_own" on public.onboarding_data;
create policy "onboarding_rw_own" on public.onboarding_data
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "subscriptions_rw_own" on public.subscriptions;
create policy "subscriptions_rw_own" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_progress_rw_own" on public.user_progress;
create policy "user_progress_rw_own" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "streaks_rw_own" on public.streaks;
create policy "streaks_rw_own" on public.streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTE (security): subscriptions.status/plan are owner-writable here so the
-- current pre-payment flow can mark a plan active. Before real billing, revoke
-- client UPDATE on these columns and set them only from a payment webhook using
-- the service-role key.

-- ════════════════════════════════════════════════════════════════════════
-- Auto-provision all five rows when a new auth user is created
-- ════════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
    values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
    on conflict (id) do nothing;
  insert into public.onboarding_data (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.subscriptions  (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_progress  (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.streaks        (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Recreate the trigger last (after its target tables exist).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════
-- Backfill rows for any users created BEFORE this migration (e.g. test users)
-- ════════════════════════════════════════════════════════════════════════
insert into public.profiles (id, email, full_name)
  select id, email, coalesce(raw_user_meta_data ->> 'full_name', '') from auth.users
  on conflict (id) do nothing;
insert into public.onboarding_data (user_id) select id from auth.users on conflict (user_id) do nothing;
insert into public.subscriptions  (user_id) select id from auth.users on conflict (user_id) do nothing;
insert into public.user_progress  (user_id) select id from auth.users on conflict (user_id) do nothing;
insert into public.streaks        (user_id) select id from auth.users on conflict (user_id) do nothing;
