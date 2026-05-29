-- AdmitFlow — profiles schema
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- Stores all per-user data: identity, language, plan, subscription, onboarding,
-- streak and progress. Protected by Row Level Security so a user can only ever
-- read/write their own row.

create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text,
  email               text,
  language            text not null default 'ru',          -- 'ru' | 'uz' | 'en' (Russian default)
  plan                text,                                  -- 'starter' | 'pro' | 'premium' | null
  subscription_status text not null default 'inactive',     -- 'inactive' | 'active' | 'past_due' | 'canceled'
  onboarded           boolean not null default false,
  onboarding          jsonb,                                 -- { degreeLevel, intendedMajor, gpa, ... }
  streak_count        integer not null default 0,
  streak_last_visit   date,
  progress            jsonb not null default '{}'::jsonb,    -- roadmap task overrides, etc.
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Keep updated_at fresh.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
