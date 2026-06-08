"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserRound, Telescope, Gauge, Send, GraduationCap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { icon: UserRound, label: "Your profile", desc: "Grades, tests, ambitions — captured once." },
  { icon: Telescope, label: "Discover", desc: "Search 60+ universities by fit, not noise." },
  { icon: Gauge, label: "Know your odds", desc: "Honest admission probability for every target." },
  { icon: Send, label: "Apply with a plan", desc: "Deadlines, essays and scholarships, sequenced." },
  { icon: GraduationCap, label: "Get admitted", desc: "Turn uncertainty into a decision letter." },
];

export function AdmissionJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "center 55%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,hsl(214_44%_97%),hsl(220_30%_99%))]" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-[0.4]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease }}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/80"
          >
            The journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl"
          >
            Admissions, <span className="italic text-gradient">visualized.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            One continuous path from where you stand today to where you&apos;ll study tomorrow.
          </motion.p>
        </div>

        {/* Flow */}
        <div ref={ref} className="relative mt-20">
          {/* connecting line (desktop) — fills as you scroll */}
          <div className="absolute left-0 right-0 top-[34px] hidden h-px bg-border lg:block">
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full origin-left bg-[linear-gradient(90deg,hsl(var(--brand-indigo)),hsl(var(--brand-cyan)))]"
            />
          </div>

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className="group relative text-center lg:text-left"
              >
                <div className="relative z-10 mx-auto grid size-[68px] place-items-center rounded-2xl border border-border bg-card shadow-[0_18px_50px_-26px_hsl(224_50%_30%/0.4)] transition-transform duration-300 group-hover:-translate-y-1 lg:mx-0">
                  <s.icon className="size-7 text-primary" />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-medium">{s.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
