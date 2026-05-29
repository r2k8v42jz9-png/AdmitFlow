# AdmitFlow — Deployment & configuration

## 1. Exact `.env.local` (local development)

```dotenv
# Supabase (real auth + database)
NEXT_PUBLIC_SUPABASE_URL=https://upzxgxmjfzqrmcnjjorv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Z4-pQ24EgQ6HRm_WiYbNMA_ScN8gJ-V

# AI Mentor (optional — defaults to the built-in rule-based engine)
AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# Payments (optional — defaults to clearly-labeled mock checkout)
PAYMENT_PROVIDER=mock
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

> `NEXT_PUBLIC_SUPABASE_ANON_KEY` holds your **publishable** key. Publishable keys
> are browser-safe and protected by RLS. Never put a `sb_secret_…` (service-role)
> key in any `NEXT_PUBLIC_*` variable.

## 2. Exact Vercel environment variables

Project → **Settings → Environment Variables** (set for **Production** + **Preview**):

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://upzxgxmjfzqrmcnjjorv.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Z4-pQ24EgQ6HRm_WiYbNMA_ScN8gJ-V` | Production, Preview |
| `AI_PROVIDER` | `mock` (or `openai`/`anthropic`/`gemini`) | Production, Preview |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` | your key (if used) | Production |
| `PAYMENT_PROVIDER` | `mock` (until billing keys are added) | Production, Preview |

After adding/changing vars, **redeploy**.

## 3. Supabase Auth configuration steps
1. **Authentication → Providers → Email** → enable **Confirm email** (already ON for this project ✅).
2. **Authentication → URL Configuration → Site URL**: set to your domain (e.g. `https://your-app.vercel.app`).
3. **Authentication → URL Configuration → Redirect URLs**: add
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback`
4. Run the database migration: **SQL Editor → paste `supabase/migrations/0001_init.sql` → Run.**
   (Creates `profiles`, `onboarding_data`, `subscriptions`, `user_progress`, `streaks` + RLS + the `handle_new_user` trigger.)

## 4. Google OAuth configuration steps
1. **Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID → Web application.**
2. Authorized redirect URI:
   `https://upzxgxmjfzqrmcnjjorv.supabase.co/auth/v1/callback`
3. Copy the **Client ID** + **Client secret**.
4. **Supabase → Authentication → Providers → Google** → enable, paste Client ID + secret, save.
   (Currently **disabled** for this project — must be enabled for Google login to work.)

## 5. Deployment checklist
- [ ] `0001_init.sql` run in Supabase (tables + RLS exist — verify `profiles` returns 200, not 404).
- [ ] Email "Confirm email" enabled.
- [ ] Google provider enabled with client ID/secret.
- [ ] Site URL + redirect URLs set (localhost + production).
- [ ] Vercel env vars set for Production + Preview; redeployed.
- [ ] `npm run build` passes (it does locally).
- [ ] Smoke test on production: Register → email → verify → Login → Onboarding → Pricing → Dashboard.
- [ ] Before real billing: revoke client write access to `subscriptions.status`/`plan`; set them only from a payment webhook using the service-role key.
- [ ] Delete any test users created during verification (Authentication → Users).
