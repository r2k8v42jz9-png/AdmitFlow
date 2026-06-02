"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updatePassword, signOutSupabase } from "@/lib/supabase/auth";
import { useT } from "@/lib/i18n";

const MIN_LEN = 8;

type Status = "checking" | "ready" | "no-session" | "success";

export function ResetPasswordForm() {
  const router = useRouter();
  const { t } = useT();
  const [status, setStatus] = useState<Status>("checking");
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The recovery session is established by /auth/callback (exchangeCodeForSession)
  // BEFORE we land here. Confirm it exists so we can show a clear message instead
  // of a failing updateUser when the link is invalid/expired/opened elsewhere.
  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("no-session");
      return;
    }
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (active) setStatus(data.user ? "ready" : "no-session");
      })
      .catch(() => {
        if (active) setStatus("no-session");
      });
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_LEN) {
      setError(t("auth.resetTooShort"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.resetMismatch"));
      return;
    }

    setLoading(true);
    const r = await updatePassword(password);
    if (!r.ok) {
      setError(r.error ?? t("auth.resetGenericError"));
      setLoading(false);
      return;
    }

    // Success: drop the recovery session and send the user to sign in fresh.
    setStatus("success");
    await signOutSupabase();
    setTimeout(() => router.replace("/login"), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("auth.resetTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("auth.resetSubtitle")}</p>
      </div>

      {status === "checking" && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {t("auth.resetChecking")}
        </p>
      )}

      {status === "no-session" && (
        <div className="space-y-4">
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {t("auth.resetNoSession")}
          </p>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/login">{t("auth.backToLogin")}</Link>
          </Button>
        </div>
      )}

      {status === "success" && (
        <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3.5 py-2.5 text-sm text-success">
          <Check className="size-4" /> {t("auth.resetSuccess")}
        </p>
      )}

      {status === "ready" && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("auth.newPassword")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-4" />
              </span>
              <Input
                id="password"
                type={showPw ? "text" : "password"}
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
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-4" />
              </span>
              <Input
                id="confirm"
                type={showPw ? "text" : "password"}
                required
                className="pl-10"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {t("auth.resetSubmit")} <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
