"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, loginUser, getUserState } from "@/lib/user-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
    <path d="M16.36 12.78c.02 2.43 2.13 3.24 2.16 3.25-.02.06-.34 1.16-1.12 2.3-.67.98-1.37 1.96-2.47 1.98-1.08.02-1.43-.64-2.66-.64-1.24 0-1.62.62-2.64.66-1.06.04-1.87-1.06-2.55-2.04-1.39-2-2.45-5.66-1.02-8.13.71-1.23 1.97-2 3.34-2.02 1.04-.02 2.02.7 2.66.7.63 0 1.83-.86 3.08-.74.52.02 1.99.21 2.93 1.59-.08.05-1.75 1.02-1.73 3.04ZM14.4 4.6c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.86 2.48.9.07 1.83-.46 2.39-1.14Z" />
  </svg>
);

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<null | "email" | "google" | "apple">(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const routeAfterLogin = () => {
    const s = getUserState();
    router.replace(!s.onboarded ? "/onboarding" : !s.plan ? "/pricing" : "/dashboard");
  };

  const handleSubmit = (provider: "email" | "google" | "apple") => async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(provider);
    const resolvedEmail = email.trim();

    // ---- Real Supabase auth (when configured) ----
    if (isSupabaseConfigured()) {
      try {
        if (provider === "google") {
          const r = await signInWithGoogle();
          if (!r.ok) {
            setError(r.error ?? "Google sign-in failed");
            setLoading(null);
          }
          return; // browser redirects to Google
        }
        if (provider === "apple") {
          setError("Apple sign-in isn't enabled yet — use Google or email.");
          setLoading(null);
          return;
        }
        if (isSignup) {
          const r = await signUpWithEmail(name, resolvedEmail, password);
          if (!r.ok) {
            setError(r.error ?? "Sign-up failed");
            setLoading(null);
            return;
          }
          router.replace("/verify-email");
          return;
        }
        const r = await signInWithEmail(resolvedEmail, password);
        if (!r.ok) {
          setError(r.error ?? "Sign-in failed");
          setLoading(null);
          return;
        }
        if (r.needsVerification) {
          router.replace("/verify-email");
          return;
        }
        routeAfterLogin();
        return;
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(null);
        return;
      }
    }

    // ---- Local fallback (Supabase not configured — dev only) ----
    await new Promise((r) => setTimeout(r, 1100));
    const fallbackEmail = resolvedEmail || (provider === "google" ? "you@gmail.com" : "you@icloud.com");
    if (isSignup) {
      registerUser(name, fallbackEmail);
      router.replace("/onboarding");
      return;
    }
    loginUser(fallbackEmail, name);
    routeAfterLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Start your journey to a top university in just two minutes."
            : "Sign in to continue building your admission plan."}
        </p>
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={handleSubmit("google")} disabled={!!loading}>
          {loading === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />} Google
        </Button>
        <Button variant="outline" size="lg" onClick={handleSubmit("apple")} disabled={!!loading}>
          {loading === "apple" ? <Loader2 className="size-4 animate-spin" /> : <AppleIcon />} Apple
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit("email")} className="space-y-4">
        {isSignup && (
          <Field label="Full name" htmlFor="name" icon={<User className="size-4" />}>
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
        <Field label="Email" htmlFor="email" icon={<Mail className="size-4" />}>
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
        <Field label="Password" htmlFor="password" icon={<Lock className="size-4" />}>
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder={isSignup ? "Create a password" : "Enter your password"}
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
              Remember me
            </label>
            <Link href="#" className="text-primary hover:underline">Forgot password?</Link>
          </div>
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
              {isSignup ? "Create account" : "Sign in"} <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {isSignup && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="#" className="text-foreground/80 hover:underline">Terms</Link> and{" "}
          <Link href="#" className="text-foreground/80 hover:underline">Privacy Policy</Link>.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account?" : "New to AdmitFlow?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-primary hover:underline">
          {isSignup ? "Sign in" : "Create one"}
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
