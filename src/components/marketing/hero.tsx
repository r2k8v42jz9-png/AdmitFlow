"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, ShieldCheck, TrendingUp, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { ScoreRing } from "@/components/shared/score-ring";
import { universityLogos } from "@/lib/data/marketing";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <AuroraBackground variant="hero" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-sm backdrop-blur-sm"
          >
            <span className="flex items-center gap-1 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
            <span className="text-muted-foreground">Trusted by 128,000+ students worldwide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="mt-6 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl md:leading-[1.05]"
          >
            Your AI mentor to the <span className="text-gradient">world&apos;s best</span> universities
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl"
          >
            AdmitFlow estimates your admission chances, builds a personalized roadmap, finds
            scholarships and reviews your essays — so you apply with total confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto">
              <Link href="/signup">
                Build my admission plan <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
              <Link href="/pricing">
                <Sparkles className="size-4" /> See plans
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><CircleCheckBig className="size-3.5 text-success" /> 2-minute setup</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-success" /> Cancel anytime</span>
            <span className="inline-flex items-center gap-1.5"><TrendingUp className="size-3.5 text-success" /> 3.2× better outcomes</span>
          </motion.div>
        </div>

        <HeroMockup />
      </div>

      {/* logo strip */}
      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          Students admitted to
        </p>
        <div className="mask-fade-x mt-5 flex gap-10 overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pause-on-hover">
            {[...universityLogos, ...universityLogos].map((name, i) => (
              <span key={i} className="whitespace-nowrap font-display text-lg font-semibold text-muted-foreground/60">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.25 }}
      style={{ perspective: 1200 }}
      className="relative mx-auto mt-16 max-w-4xl"
    >
      <div className="animated-border rounded-[1.75rem]">
        <div className="glass-strong overflow-hidden rounded-[1.7rem] p-2 shadow-card">
          <div className="grid gap-3 rounded-3xl bg-background/40 p-3 md:grid-cols-[1.5fr_1fr]">
            {/* Chat panel */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <span className="size-2.5 rounded-full bg-brand-pink/80" />
                <span className="size-2.5 rounded-full bg-warning/80" />
                <span className="size-2.5 rounded-full bg-success/80" />
                <span className="ml-2 text-xs text-muted-foreground">AdmitFlow Mentor</span>
              </div>
              <div className="space-y-3 pt-4">
                <ChatBubble role="user">What are my chances at MIT?</ChatBubble>
                <ChatBubble role="ai">
                  With your <strong>1520 SAT</strong> and robotics medal, I estimate <strong>~31%</strong> for MIT
                  Early Action. Add a second STEM recommendation to push it higher. Want a plan?
                </ChatBubble>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Build my roadmap", "Find scholarships", "Review my essay"].map((c) => (
                    <span key={c} className="rounded-full border border-border/70 bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Score panel */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/60 p-4 text-center">
                <ScoreRing value={74} size={120} label="Admission" gradientId="hero-ring" />
                <p className="mt-2 text-xs text-muted-foreground">Your live admission score</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ETH Zürich</span>
                  <span className="font-semibold text-success">91 fit</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[91%] rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating accents */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-1/3 hidden rounded-2xl glass-strong px-4 py-3 shadow-card md:block"
      >
        <p className="text-xs text-muted-foreground">Deadline in</p>
        <p className="font-display text-lg font-bold">12 days</p>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-6 bottom-10 hidden items-center gap-2 rounded-2xl glass-strong px-4 py-3 shadow-card md:flex"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-success/15 text-success">
          <CircleCheckBig className="size-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Application</p>
          <p className="text-sm font-semibold">Submitted ✓</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white">
        <Sparkles className="size-3.5" />
      </span>
      <p className="max-w-[85%] rounded-2xl rounded-tl-md border border-border/60 bg-background/60 px-3.5 py-2 text-sm text-foreground/90">
        {children}
      </p>
    </div>
  );
}
