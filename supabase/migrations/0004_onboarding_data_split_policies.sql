-- ════════════════════════════════════════════════════════════════════════
-- AdmitFlow — split onboarding_data's single ALL policy into explicit
-- per-command policies (diagnostic clarity, not a behavior change).
--
-- "onboarding_rw_own" was `for all using (auth.uid() = user_id) with check
-- (auth.uid() = user_id)`, which already covers SELECT/INSERT/UPDATE/DELETE
-- identically to the four policies below. This is a diagnostic step while
-- tracking down why the onboarding_data upsert fails — splitting it makes
-- each command's rule individually visible in the Dashboard.
--
-- Run the ENTIRE file in Supabase → SQL Editor → Run. Safe to re-run.
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "onboarding_rw_own" on public.onboarding_data;

create policy "onboarding_select_own" on public.onboarding_data
  for select
  using (auth.uid() = user_id);

create policy "onboarding_insert_own" on public.onboarding_data
  for insert
  with check (auth.uid() = user_id);

create policy "onboarding_update_own" on public.onboarding_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Included even though only SELECT/INSERT/UPDATE were requested: the original
-- "for all" policy already covered DELETE too (used by deleteAccount() in
-- src/lib/supabase/data.ts). Dropping it without this would silently break
-- "Delete account" for this table.
create policy "onboarding_delete_own" on public.onboarding_data
  for delete
  using (auth.uid() = user_id);
