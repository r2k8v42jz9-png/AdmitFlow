"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { DynamicIcon } from "@/components/shared/icon";
import { roadmap } from "@/lib/data/app";
import { cn } from "@/lib/utils";

export function RoadmapPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-brand-violet" /> Your journey, mapped</>}
          title="A roadmap from today to acceptance"
          description="AdmitFlow turns the overwhelming admissions process into a clear, month-by-month plan with milestones and tasks."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-1/2" />

          <div className="space-y-8">
            {roadmap.map((m, i) => {
              const side = i % 2 === 0;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative flex items-start gap-5 md:w-1/2",
                    side ? "md:ml-0 md:pr-10 md:text-right md:flex-row-reverse" : "md:ml-auto md:pl-10",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border text-sm md:absolute md:top-1",
                      side ? "md:-right-5" : "md:-left-5",
                      m.status === "done"
                        ? "border-success/40 bg-success/15 text-success"
                        : m.status === "active"
                          ? "border-primary/50 bg-primary/15 text-primary glow-ring"
                          : "border-border bg-card/60 text-muted-foreground",
                    )}
                  >
                    {m.status === "done" ? <Check className="size-5" /> : <DynamicIcon name={m.icon} className="size-5" />}
                  </span>
                  <div className="flex-1 rounded-2xl border border-border/70 bg-card/50 p-5 backdrop-blur-sm">
                    <div className={cn("flex items-center gap-2", side && "md:flex-row-reverse")}>
                      <h3 className="font-display font-semibold">{m.title}</h3>
                      {m.status === "active" && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          In progress
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.window}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
