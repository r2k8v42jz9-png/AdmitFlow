# AdmitFlow — Supabase setup (real auth + database)

Real Supabase Auth + Postgres activate automatically once the anon key is set.
This project's URL is already wired in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://upzxgxmjfzqrmcnjjorv.supabase.co
```

You only need to (1) add the anon key, (2) run the migration, (3) flip on email
+ Google in the dashboard.

---

## 1. Environment variables

### Local development (`.env.local`)
| Variable | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://upzxgxmjfzqrmcnjjorv.supabase.co` (already set) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Dashboard → Settings → API → **anon public** |
| `AI_PROVIDER` | optional | `mock` \| `openai` \| `anthropic` \| `gemini` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` | optional | for the AI Mentor |
| `PAYMENT_PROVIDER` | optional | `mock` \| `stripe` \| `payme` \| `click` \| `octo` \| `payze` |

After editing `.env.local`, restart `npm run dev`.

### Vercel production (Project → Settings → Environment Variables)
Set the **same** variables for the **Production** (and Preview) environments:

| Variable | Required |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `AI_PROVIDER` + the matching `*_API_KEY` | optional |
| `PAYMENT_PROVIDER` + provider keys | optional |

> `NEXT_PUBLIC_*` vars are exposed to the browser (safe for the anon key — it's
> protected by Row Level Security). **Never** put the `service_role` key in a
> `NEXT_PUBLIC_*` var or in client code.

---

## 2. Database migration

Open **SQL Editor** in Supabase and run `supabase/migrations/0001_init.sql`
(or `supabase db push` with the CLI). It creates five RLS-protected tables:

| Table | Holds |
|---|---|
| `profiles` | identity + language (RU default) |
| `onboarding_data` | GPA, IELTS, SAT, major, budget, countries, strengths, dream universities, intake, career goals |
| `subscriptions` | plan + billing status |
| `user_progress` | roadmap task progress |
| `streaks` | daily-return streak |

A trigger (`handle_new_user`) auto-creates all five rows for every new account.

---

## 3. Authentication — email verification
**Authentication → Providers → Email**: enable **Confirm email**. New sign-ups
then receive a verification link and **cannot reach the dashboard until they
confirm** (`src/proxy.ts` enforces this server-side, and the client flow routes
unverified users to `/verify-email`).

---

## 4. Google OAuth
1. In **Google Cloud Console** create an OAuth 2.0 Client (Web). Authorized
   redirect URI: `https://upzxgxmjfzqrmcnjjorv.supabase.co/auth/v1/callback`.
2. **Supabase → Authentication → Providers → Google**: enable, paste the Google
   client ID + secret.
3. **Supabase → Authentication → URL Configuration → Redirect URLs**: add
   `http://localhost:3000/auth/callback` and `https://YOUR-DOMAIN/auth/callback`.

---

## 5. Verify the flow
Register → **Verify Email** → Login → Onboarding → Pricing → Dashboard.
- Visit `/dashboard` signed out → redirected to `/login`.
- Sign in before confirming → redirected to `/verify-email`.

## Where it lives
| Concern | File |
|---|---|
| Config / feature flag | `src/lib/supabase/config.ts` |
| Browser / server clients | `src/lib/supabase/client.ts`, `server.ts` |
| Session refresh + route protection | `src/proxy.ts`, `src/lib/supabase/proxy-session.ts` |
| Global session hydration | `src/components/providers/session-sync.tsx` |
| Auth flows (email / Google / verify) | `src/lib/supabase/auth.ts` |
| Data layer (5 tables) | `src/lib/supabase/data.ts` |
| OAuth / email callback | `src/app/auth/callback/route.ts` |
| Schema + RLS | `supabase/migrations/0001_init.sql` |
