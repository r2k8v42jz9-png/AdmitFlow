"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signUpWithEmail, signInWithEmail, signInWithGoogle, fetchEnabledProviders, sendPasswordReset } from "@/lib/supabase/auth";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Maps known raw Supabase auth errors to localized, non-enumerating messages.
 * "User already registered" confirms an account exists (user enumeration), so
 * it's replaced with a neutral hint; "Invalid login credentials" gets a
 * translation plus a Google-provider hint (OAuth-only accounts have no
 * password, and this is the error they hit). Unknown errors pass through.
 */
function mapAuthError(raw: string | undefined, t: (key: string) => string, fallback: string): string {
  if (!raw) return fallback;
  const msg = raw.toLowerCase();
  if (msg.includes("already registered")) return t("auth.err.exists");
  if (msg.includes("invalid login credentials")) return t("auth.err.invalidCreds");
  return raw;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { t } = useT();
  const isSignup = mode === "signup";
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<null | "email" | "google">(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  const onForgotPassword = async () => {
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured()) {
      setError(t("auth.resetUnavailable"));
      return;
    }
    if (!email.trim()) {
      setError(t("auth.resetNeedEmail"));
      return;
    }
    const r = await sendPasswordReset(email.trim());
    if (r.ok) setNotice(t("auth.resetSent"));
    else setError(r.error ?? t("auth.resetUnavailable"));
  };

  // Detect whether Google OAuth is enabled in Supabase so we can show a clear
  // message instead of a broken redirect. (Apple is intentionally removed.)
  useEffect(() => {
    let active = true;
    fetchEnabledProviders().then((p) => {
      if (active) setGoogleEnabled(p.google);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (provider: "email" | "google") => async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    // Real Supabase auth only — no mock/localStorage fallback.
    if (!isSupabaseConfigured()) {
      setError("Authentication isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(provider);
    const resolvedEmail = email.trim();

    try {
      if (provider === "google") {
        if (!googleEnabled) {
          // Clear message instead of a broken OAuth redirect.
          setError(t("auth.googleUnavailable"));
          setLoading(null);
          return;
        }
        const r = await signInWithGoogle();
        if (!r.ok) {
          setError(r.error ?? t("auth.googleUnavailable"));
          setLoading(null);
        }
        return; // browser redirects to Google
      }
      if (isSignup) {
        const r = await signUpWithEmail(name, resolvedEmail, password);
        if (!r.ok) {
          setError(mapAuthError(r.error, t, t("auth.err.signupFailed")));
          setLoading(null);
          return;
        }
        // Email verification is disabled — go straight into onboarding.
        router.replace("/onboarding");
        return;
      }
      const r = await signInWithEmail(resolvedEmail, password);
      if (!r.ok) {
        setError(mapAuthError(r.error, t, t("auth.err.signinFailed")));
        setLoading(null);
        return;
      }
      // Head to the app; the proxy/AppGate cascade routes to the correct next
      // step (onboarding → pricing → dashboard) from real DB state.
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {isSignup ? t("auth.signupTitle") : t("auth.loginTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup ? t("auth.signupSubtitle") : t("auth.loginSubtitle")}
        </p>
      </div>

      {/* Social — Google only (Apple intentionally removed for demo) */}
      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" size="lg" onClick={handleSubmit("google")} disabled={!!loading}>
          {loading === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />} Google
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("auth.orEmail")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit("email")} className="space-y-4">
        {isSignup && (
          <Field label={t("auth.fullName")} htmlFor="name" icon={<User className="size-4" />}>
            <Input
              id="name"
              placeholder="Aziz Saburov"
              required
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        )}
        <Field label={t("auth.email")} htmlFor="email" icon={<Mail className="size-4" />}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label={t("auth.password")} htmlFor="password" icon={<Lock className="size-4" />}>
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder={isSignup ? t("auth.createPassword") : t("auth.enterPassword")}
            required
            className="px-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle password visibility"
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </Field>

        {!isSignup && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <span className="grid size-4 place-items-center rounded border border-border peer-checked:bg-primary peer-checked:border-primary peer-checked:[&_svg]:opacity-100">
                <Check className="size-3 text-primary-foreground opacity-0" />
              </span>
              {t("auth.rememberMe")}
            </label>
            <button type="button" onClick={onForgotPassword} className="text-primary hover:underline">
              {t("auth.forgot")}
            </button>
          </div>
        )}

        {notice && (
          <p className="rounded-xl border border-success/30 bg-success/10 px-3.5 py-2.5 text-sm text-success">
            {notice}
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={!!loading}>
          {loading === "email" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {isSignup ? t("auth.createAccount") : t("common.signIn")} <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {isSignup && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="/" className="text-foreground/80 hover:underline">Terms</Link> and{" "}
          <Link href="/" className="text-foreground/80 hover:underline">Privacy Policy</Link>.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-primary hover:underline">
          {isSignup ? t("common.signIn") : t("auth.createOne")}
        </Link>
      </p>
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="relative">
        <span className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground")}>{icon}</span>
        {children}
      </div>
    </div>
  );
}
