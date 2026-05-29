# Supabase setup (real authentication & data)

AdmitFlow ships with a **complete, production-ready** Supabase integration. It
activates automatically once you provide credentials. Until then the app runs
on a clearly-labeled local fallback session (dev only — not real auth).

> **Status:** the integration code is written and type-checks, but it has **not
> been verified against a live Supabase project in this environment** (no
> credentials available here). Treat "verified" as pending until you complete
> the steps below. This is the single remaining production blocker for auth.

## 1. Create the project
1. Create a project at https://supabase.com.
2. Project → **Settings → API**: copy the **Project URL** and **anon public key**.

## 2. Add environment variables
Create `.env.local` (see `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Restart `npm run dev`.

## 3. Run the database migration
Open **SQL Editor** in Supabase and run `supabase/migrations/0001_profiles.sql`
(or `supabase db push` with the CLI). This creates the `profiles` table with Row
Level Security and an auto-create-profile trigger.

## 4. Enable email verification
**Authentication → Providers → Email**: enable **Confirm email**. New sign-ups
then receive a verification link and cannot reach the dashboard until confirmed
(`proxy.ts` enforces this server-side).

## 5. Enable Google OAuth
1. **Authentication → Providers → Google**: enable it, add your Google OAuth
   client ID + secret (from Google Cloud Console).
2. **Authentication → URL Configuration**: add redirect URL
   `http://localhost:3000/auth/callback` (and your production equivalent).

## 6. Verify the flow
- Register → receive email → confirm → land on `/onboarding`.
- Sign in unverified → redirected to `/verify-email`.
- Visit `/dashboard` while signed out → redirected to `/login`.

## How it's wired
| Concern | File |
|---|---|
| Config / feature flag | `src/lib/supabase/config.ts` |
| Browser client | `src/lib/supabase/client.ts` |
| Server client | `src/lib/supabase/server.ts` |
| Session refresh + route protection | `src/proxy.ts`, `src/lib/supabase/proxy-session.ts` |
| Auth flows (email/Google/verify) | `src/lib/supabase/auth.ts` |
| Profile read/write | `src/lib/supabase/profiles.ts` |
| OAuth / email callback | `src/app/auth/callback/route.ts` |
| Schema + RLS | `supabase/migrations/0001_profiles.sql` |
