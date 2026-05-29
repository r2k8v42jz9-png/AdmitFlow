"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MailCheck, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "checking" | "resent" | "verified" | "error">("idle");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    let active = true;
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (user?.email) setEmail(user.email);
      if (user && (user.email_confirmed_at || user.confirmed_at)) {
        setStatus("verified");
      }
    })();
    return () => {
      active = false;
    };
  }, [configured]);

  const resend = async () => {
    if (!configured || !email) return;
    setStatus("checking");
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setStatus(error ? "error" : "resent");
  };

  const refreshStatus = async () => {
    setStatus("checking");
    if (!configured) {
      // Local fallback flow has no email step — continue to onboarding.
      router.replace("/onboarding");
      return;
    }
    const { createClient } = await import("@/lib/supabase/client");
    const { hydrateLocalFromProfile } = await import("@/lib/supabase/auth");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && (user.email_confirmed_at || user.confirmed_at)) {
      await hydrateLocalFromProfile();
      router.replace("/onboarding");
    } else {
      setStatus("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-border/70 bg-card/60 text-primary">
        <MailCheck className="size-7" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a verification link{email ? <> to <span className="font-medium text-foreground">{email}</span></> : ""}.
        Click it to activate your account, then come back to continue.
      </p>

      {!configured && (
        <p className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-left text-xs text-warning">
          Email verification requires Supabase to be configured (see SUPABASE_SETUP.md). In local
          mode there is no email step — use Continue below.
        </p>
      )}

      <div className="mt-7 space-y-3">
        <Button variant="gradient" size="lg" className="w-full" onClick={refreshStatus} disabled={status === "checking"}>
          {status === "checking" ? <Loader2 className="size-4 animate-spin" /> : <>I&apos;ve verified — continue <ArrowRight className="size-4" /></>}
        </Button>
        {configured && (
          <Button variant="outline" size="lg" className="w-full" onClick={resend} disabled={!email || status === "checking"}>
            <RefreshCw className="size-4" /> {status === "resent" ? "Verification email sent" : "Resend verification email"}
          </Button>
        )}
      </div>

      {status === "error" && (
        <p className="mt-3 text-xs text-destructive">Couldn&apos;t resend right now. Try again in a moment.</p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Wrong account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
