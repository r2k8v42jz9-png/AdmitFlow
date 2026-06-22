"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserRound, Telescope, Gauge, Send, GraduationCap } from "lucide-react";
import { fadeUp, fadeUpLg, staggerContainer, transitions, viewportOnce } from "@/lib/motion";
import { useT } from "@/lib/i18n";

const STEPS = [
  { icon: UserRound, key: "profile" },
  { icon: Telescope, key: "discover" },
  { icon: Gauge, key: "odds" },
  { icon: Send, key: "apply" },
  { icon: GraduationCap, key: "admitted" },
];

export function AdmissionJourney() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "center 55%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,hsl(214_44%_97%),hsl(220_30%_99%))] dark:bg-[radial-gradient(120%_90%_at_50%_0%,hsl(222_42%_7%),hsl(224_48%_5%))]" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-[0.4] dark:opacity-[0.18]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={transitions.snappy}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/80"
          >
            {t("journey.eyebrow")}
          </motion.span>
          <motion.h2
            variants={fadeUpLg}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ ...transitions.slow, delay: 0.05 }}
            className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-balance sm:text-6xl"
          >
            {t("journey.title")} <span className="italic text-gradient">{t("journey.titleAccent")}</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ ...transitions.slow, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            {t("journey.subtitle")}
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

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5"
          >
            {STEPS.map((s, i) => (
              <motion.li
                key={s.key}
                variants={fadeUpLg}
                transition={transitions.base}
                className="group relative text-center lg:text-left"
              >
                <div className="relative z-10 mx-auto grid size-[68px] place-items-center rounded-2xl border border-border bg-card shadow-[0_18px_50px_-26px_hsl(224_50%_30%/0.4)] transition-transform duration-300 group-hover:-translate-y-1 lg:mx-0">
                  <s.icon className="size-7 text-primary" />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-medium">{t(`journey.${s.key}.label`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(`journey.${s.key}.desc`)}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
