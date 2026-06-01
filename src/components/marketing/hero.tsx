"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Library, Globe2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { universityLogos } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <AuroraBackground variant="hero" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            <GraduationCap className="size-3.5 text-primary" />
            {t("hero.rated")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="mt-6 font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl md:text-7xl"
          >
            {t("hero.titleLead")}
            <span className="italic text-primary underline decoration-primary/30 decoration-[3px] underline-offset-[8px]">
              {t("hero.titleAccent")}
            </span>
            {t("hero.titleTrail")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto">
              <Link href="/signup">
                {t("hero.ctaPrimary")} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
              <Link href="/pricing">{t("hero.ctaSecondary")}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="size-4 text-primary/70" /> {t("hero.trust1")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Library className="size-4 text-primary/70" /> {t("hero.trust2")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe2 className="size-4 text-primary/70" /> {t("hero.trust3")}
            </span>
          </motion.div>
        </div>

        <AdmissionDossier t={t} />
      </div>

      {/* University wordmarks — editorial serif, set as a quiet honor roll */}
      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          {t("hero.admittedTo")}
        </p>
        <div className="mask-fade-x mt-5 flex gap-12 overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pause-on-hover">
            {[...universityLogos, ...universityLogos].map((name, i) => (
              <span key={i} className="whitespace-nowrap font-display text-xl font-medium text-foreground/45">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Editorial "Admission Profile" — presented like a consulting firm's prepared
 * candidate dossier rather than a chat UI. Reinforces the admissions-consulting
 * (not AI-SaaS) positioning. Decorative; content is illustrative.
 */
function AdmissionDossier({ t }: { t: (k: string) => string }) {
  const academics = [
    { label: t("hero.dossier.gpa"), value: "3.9", sub: "/ 4.0" },
    { label: "IELTS", value: "8.0", sub: "/ 9.0" },
    { label: "SAT", value: "1520", sub: "/ 1600" },
  ];
  const shortlist = [
    { name: "Massachusetts Institute of Technology", tag: t("hero.dossier.reach"), tone: "text-warning", fit: 74 },
    { name: "ETH Zürich", tag: t("hero.dossier.target"), tone: "text-primary", fit: 91 },
    { name: "University of Toronto", tag: t("hero.dossier.safety"), tone: "text-success", fit: 96 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.25 }}
      className="relative mx-auto mt-16 max-w-3xl"
    >
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-card backdrop-blur-sm">
        {/* Letterhead */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-border/60 bg-background/60 text-primary">
              <GraduationCap className="size-4.5" />
            </span>
            <div className="text-left">
              <p className="font-display text-sm font-medium leading-tight">{t("hero.dossier.title")}</p>
              <p className="text-xs text-muted-foreground">{t("hero.dossier.preparedFor")}</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-border/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            {t("hero.dossier.confidential")}
          </span>
        </div>

        {/* Academic readout */}
        <div className="grid grid-cols-3 divide-x divide-border/50 border-b border-border/60">
          {academics.map((a) => (
            <div key={a.label} className="px-5 py-4 text-left">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{a.label}</p>
              <p className="mt-1 font-display text-2xl font-medium tabular-nums leading-none">
                {a.value}
                <span className="ml-1 text-xs font-normal text-muted-foreground">{a.sub}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Recommended shortlist */}
        <div className="px-6 py-5">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t("hero.dossier.shortlist")}
          </p>
          <div className="space-y-2.5">
            {shortlist.map((u) => (
              <div key={u.name} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate font-display text-[15px] text-foreground/90">{u.name}</span>
                <span className={`shrink-0 text-[11px] font-medium uppercase tracking-wider ${u.tone}`}>{u.tag}</span>
                <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">{u.fit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Counselor note */}
        <div className="border-t border-border/60 bg-background/40 px-6 py-4">
          <div className="flex gap-3">
            <Quote className="size-4 shrink-0 text-primary/50" />
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              {t("hero.dossier.note")}
              <span className="mt-1 block not-italic text-xs font-medium text-foreground/70">
                {t("hero.dossier.noteAuthor")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
