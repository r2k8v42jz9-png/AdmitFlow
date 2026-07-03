-- ════════════════════════════════════════════════════════════════════════
-- AdmitFlow — lock down subscriptions writes (C1)
--
-- subscriptions_rw_own was `for all`, letting any signed-in user upsert
-- their own plan/status with the public anon key — i.e. self-grant Pro/Max
-- from the browser console. From now on clients may only READ their row;
-- all writes happen through the payment webhook using the service-role key
-- (which bypasses RLS by design).
--
-- Run the ENTIRE file in Supabase → SQL Editor → Run. Safe to re-run.
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "subscriptions_rw_own" on public.subscriptions;

create policy "subscriptions_select_own" on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies → those commands are denied for the
-- authenticated role entirely. The handle_new_user trigger (0001) still
-- provisions the initial row: it runs as the definer, not the client.
