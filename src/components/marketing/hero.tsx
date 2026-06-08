"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Constellation } from "@/components/marketing/constellation";
import { universityLogos } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useT();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* Airy light field */}
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-[0.5]" />
      <div className="absolute -right-40 -top-44 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.15),transparent_70%)] blur-2xl" />
      <div className="absolute -left-48 top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-cyan)/0.12),transparent_70%)] blur-2xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.02fr_1fr]">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground shadow-sm backdrop-blur"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {t("hero.rated")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.06 }}
            className="mt-6 font-display text-[2.7rem] font-medium leading-[1.03] tracking-[-0.025em] text-balance sm:text-6xl md:text-[4.4rem]"
          >
            {t("hero.titleLead")}
            <span className="bg-[linear-gradient(100deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue))_55%,hsl(var(--brand-cyan)))] bg-clip-text italic text-transparent">
              {t("hero.titleAccent")}
            </span>
            {t("hero.titleTrail")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.14 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty lg:mx-0"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.22 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.34 }}
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

        {/* Signature element — the living University Constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="relative"
        >
          <Constellation />
        </motion.div>
      </div>

      {/* Honor roll */}
      <div className="mx-auto mt-20 max-w-5xl px-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          {t("hero.admittedTo")}
        </p>
        <div className="mask-fade-x mt-5 flex gap-12 overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pause-on-hover">
            {[...universityLogos, ...universityLogos].map((name, i) => (
              <span key={i} className="whitespace-nowrap font-display text-lg font-medium text-foreground/35">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
