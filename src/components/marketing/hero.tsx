"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PathwaysCanvas, type PathNode } from "@/components/marketing/pathways";
import { universityLogos } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const NODES: { p: PathNode; label: string; sub: string }[] = [
  { p: { x: 0.19, y: 0.17 }, label: "MIT", sub: "Reach" },
  { p: { x: 0.81, y: 0.13 }, label: "Oxford", sub: "Reach" },
  { p: { x: 0.88, y: 0.47 }, label: "ETH Zürich", sub: "Target" },
  { p: { x: 0.74, y: 0.82 }, label: "NUS", sub: "Target" },
  { p: { x: 0.2, y: 0.83 }, label: "Toronto", sub: "Safety" },
  { p: { x: 0.1, y: 0.49 }, label: "LSE", sub: "Target" },
];

export function Hero() {
  const { t } = useT();
  const reduce = useReducedMotion() ?? false;

  // subtle 3D tilt of the panel on pointer move
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* Airy light field */}
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-[0.55]" />
      <div className="absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.16),transparent_70%)] blur-2xl" />
      <div className="absolute -left-48 top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-cyan)/0.12),transparent_70%)] blur-2xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
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

        {/* Admissions Intelligence panel */}
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          style={{ perspective: 1200 }}
          onPointerMove={(e) => {
            if (reduce) return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.div
            style={{ rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY, transformStyle: "preserve-3d" }}
            className="glass-strong relative aspect-[5/6] w-full overflow-hidden rounded-[1.6rem] shadow-[0_40px_90px_-40px_hsl(224_50%_30%/0.35)] sm:aspect-[4/5]"
          >
            {/* panel header */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Admissions Intelligence
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" /> Live
              </span>
            </div>

            {/* pathways field */}
            <div className="absolute inset-0 top-12">
              <PathwaysCanvas nodes={NODES.map((n) => n.p)} reduced={reduce} />

              {/* university chips */}
              {NODES.map((n) => (
                <div
                  key={n.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.p.x * 100}%`, top: `${n.p.y * 100}%` }}
                >
                  <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur">
                    <span className="font-display">{n.label}</span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{n.sub}</span>
                  </div>
                </div>
              ))}

              {/* central applicant node */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: "50%", top: "52%" }}
              >
                <div className="rounded-xl border border-primary/30 bg-card/95 px-3 py-1.5 text-center shadow-md">
                  <p className="font-display text-[13px] font-medium leading-none">You</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">GPA 3.9 · IELTS 8.0</p>
                </div>
              </div>
            </div>

            {/* floating probability card */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 left-4 z-20 rounded-2xl border border-border bg-card/95 p-3.5 shadow-lg backdrop-blur"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Admission probability</p>
              <div className="mt-1.5 flex items-end gap-2">
                <span className="font-display text-3xl font-semibold leading-none tabular-nums text-foreground">91%</span>
                <span className="mb-0.5 text-[11px] font-medium text-success">ETH Zürich</span>
              </div>
              <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "91%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease, delay: 0.4 }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-blue)),hsl(var(--brand-cyan)))]"
                />
              </div>
            </motion.div>
          </motion.div>
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
