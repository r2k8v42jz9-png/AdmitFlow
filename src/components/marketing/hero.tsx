"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, fadeUp, scaleIn, transitions } from "@/lib/motion";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t, locale } = useT();
  const isRu = locale === "ru";

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* Theme-aware base: white in light, deep navy in dark — soft blue ambient glow on the right */}
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(58%_70%_at_80%_40%,hsl(var(--brand-blue)/0.1),transparent_62%)] dark:bg-[radial-gradient(60%_72%_at_80%_38%,hsl(var(--brand-blue)/0.2),transparent_64%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(42%_55%_at_92%_74%,hsl(var(--brand-cyan)/0.07),transparent_60%)] dark:bg-[radial-gradient(44%_58%_at_90%_72%,hsl(var(--brand-cyan)/0.12),transparent_62%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[0.82fr_1.18fr]">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={transitions.base}
            className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80 sm:text-[11px] sm:tracking-[0.24em] lg:justify-start"
          >
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            {t("hero.rated")}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ ...transitions.slow, delay: 0.06 }}
            className={cn(
              "mt-6 max-w-[16ch] font-display font-medium tracking-[-0.025em] text-balance",
              // Russian runs ~25% longer — step the scale down and tighten leading
              // so it keeps the same vertical footprint and never crowds the constellation.
              isRu
                ? "text-[2.15rem] leading-[1.08] sm:text-5xl md:text-[3.3rem]"
                : "text-[2.7rem] leading-[1.03] sm:text-6xl md:text-[4.4rem]",
            )}
          >
            {t("hero.titleLead")}
            <span className="bg-[linear-gradient(100deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_55%,hsl(var(--brand-cyan)))] bg-clip-text italic text-transparent">
              {t("hero.titleAccent")}
            </span>
            {t("hero.titleTrail")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ ...transitions.slow, delay: 0.14 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty lg:mx-0"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ ...transitions.slow, delay: 0.22 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button asChild variant="gradient" size="xl" className="group w-full sm:w-auto">
              <Link href="/signup">
                {t("hero.ctaPrimary")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <Link href="/pricing">{t("hero.ctaSecondary")}</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={{ ...transitions.slow, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary/80" /> {t("hero.trust1")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-primary/80" /> {t("hero.trust3")}
            </span>
          </motion.div>
        </div>

        {/* Signature element — cinematic campus video with a floating glass card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="show"
          transition={{ ...transitions.slow, delay: 0.15 }}
          className="relative lg:-mr-6 xl:-mr-16"
        >
          <video
            className="aspect-video w-full rounded-2xl border border-border/60 object-cover shadow-[0_30px_80px_-32px_hsl(var(--primary)/0.5)]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/assets/hero/campus.mp4" type="video/mp4" />
          </video>

          {/* Floating glass admission card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ ...transitions.base, delay: 0.5 }}
            className="absolute -bottom-6 -left-4 w-[16.5rem] rounded-2xl border border-white/40 bg-white/75 p-4 shadow-[0_24px_70px_-28px_hsl(230_50%_20%/0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-card/70 sm:-left-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[11px] font-bold tracking-tight text-foreground shadow ring-1 ring-black/5">
                MIT
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-none">MIT</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span aria-hidden>🇺🇸</span> Cambridge, USA
                </p>
              </div>
              <span className="ml-auto shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                QS #1
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Admission chance</span>
                  <span className="font-semibold tabular-nums text-success">78%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-success" style={{ width: "78%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">IELTS</span>
                <span className="font-semibold tabular-nums">7.0</span>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" /> Scholarship available
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
