"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Library, Globe2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/marketing/globe";
import { universityLogos } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useT();

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Deep navy field + cinematic vignette */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(125%_120%_at_50%_-10%,hsl(224_60%_10%)_0%,hsl(230_45%_5%)_45%,hsl(232_50%_3%)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-[0.5]" />

      {/* Live globe — atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-[6%] -z-10 mx-auto h-[120vmin] w-[120vmin] max-w-none [mask-image:radial-gradient(circle_at_50%_46%,#000_46%,transparent_72%)]">
        <Globe />
      </div>
      {/* readability scrim behind the headline */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[68vh] bg-[radial-gradient(60%_55%_at_50%_28%,hsl(230_45%_4%/0.78),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pt-36 text-center sm:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/65 backdrop-blur-md"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          {t("hero.rated")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.06 }}
          className="mt-7 max-w-4xl font-display text-[2.9rem] font-medium leading-[1.02] tracking-[-0.025em] text-balance sm:text-7xl md:text-[5.2rem]"
        >
          {t("hero.titleLead")}
          <span className="bg-[linear-gradient(100deg,hsl(var(--brand-cyan)),hsl(var(--brand-blue))_55%,hsl(var(--brand-indigo)))] bg-clip-text italic text-transparent">
            {t("hero.titleAccent")}
          </span>
          {t("hero.titleTrail")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.14 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/65 text-pretty sm:text-xl"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.22 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild variant="gradient" size="xl" className="group w-full sm:w-auto">
            <Link href="/signup">
              {t("hero.ctaPrimary")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
            <Link href="/pricing">{t("hero.ctaSecondary")}</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.36 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-foreground/55"
        >
          <span className="inline-flex items-center gap-2">
            <GraduationCap className="size-4 text-primary/80" /> {t("hero.trust1")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Library className="size-4 text-primary/80" /> {t("hero.trust2")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Globe2 className="size-4 text-primary/80" /> {t("hero.trust3")}
          </span>
        </motion.div>
      </div>

      {/* Honor roll + scroll cue */}
      <div className="relative z-10 mx-auto mt-auto w-full max-w-5xl px-6 pb-10">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 flex justify-center"
        >
          <ChevronDown className="size-5 animate-bounce text-foreground/30" />
        </motion.div>
      </div>
    </section>
  );
}
