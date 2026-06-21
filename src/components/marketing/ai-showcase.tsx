"use client";

import { motion } from "framer-motion";
import { PenLine, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { useT } from "@/lib/i18n";

export function AIShowcase() {
  const { t } = useT();

  const feedback = [
    { icon: CheckCircle2, tone: "text-success", text: t("ai.fb.1") },
    { icon: AlertCircle, tone: "text-warning", text: t("ai.fb.2") },
    { icon: Lightbulb, tone: "text-primary", text: t("ai.fb.3") },
  ];

  const points = [
    { title: t("ai.point.1.title"), body: t("ai.point.1.body") },
    { title: t("ai.point.2.title"), body: t("ai.point.2.body") },
    { title: t("ai.point.3.title"), body: t("ai.point.3.body") },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-primary" /> {t("ai.eyebrow")}</>}
          title={t("ai.title")}
          description={t("ai.description")}
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="space-y-6">
              {points.map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-card/60 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="rounded-3xl border border-border/70 bg-card/40 p-1.5">
              <div className="glass-strong rounded-[1.35rem] p-5 shadow-card">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <PenLine className="size-4 text-primary" /> {t("ai.mockTitle")}
                </div>
                <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-4 text-sm leading-relaxed text-foreground/80">
                  <p>
                    <mark className="rounded bg-success/20 px-1 text-foreground decoration-clone">{t("ai.essay.good")}</mark>
                    {t("ai.essay.mid")}
                    <mark className="rounded bg-warning/20 px-1 text-foreground decoration-clone">{t("ai.essay.warn")}</mark>
                    {t("ai.essay.post")}
                  </p>
                </div>
                <div className="mt-4 space-y-2.5">
                  {feedback.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 * i, duration: 0.5 }}
                      className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/50 px-3.5 py-2.5"
                    >
                      <f.icon className={`mt-0.5 size-4 shrink-0 ${f.tone}`} />
                      <p className="text-sm text-foreground/85">{f.text}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5">
                  <span className="text-sm font-medium">{t("ai.strength")}</span>
                  <span className="text-sm font-semibold text-success">{t("ai.strengthValue")}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
