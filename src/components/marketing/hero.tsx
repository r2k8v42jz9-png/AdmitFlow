"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Constellation } from "@/components/marketing/constellation";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, locale } = useT();
  const isRu = locale === "ru";

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* Theme-aware base: white in light, deep navy in dark — soft blue ambient glow on the right */}
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(58%_70%_at_80%_40%,hsl(var(--brand-blue)/0.1),transparent_62%)] dark:bg-[radial-gradient(60%_72%_at_80%_38%,hsl(var(--brand-blue)/0.2),transparent_64%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(42%_55%_at_92%_74%,hsl(var(--brand-cyan)/0.07),transparent_60%)] dark:bg-[radial-gradient(44%_58%_at_90%_72%,hsl(var(--brand-cyan)/0.12),transparent_62%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[0.82fr_1.18fr]">
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
          className="relative lg:-mr-6 xl:-mr-16"
        >
          <Constellation />
        </motion.div>
      </div>
    </section>
  );
}
