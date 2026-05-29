"use client";

import { motion } from "framer-motion";
import { Sparkles, Wand2, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

const feedback = [
  { icon: CheckCircle2, tone: "text-success", text: "Strong, specific hook — the opening scene lands immediately." },
  { icon: AlertCircle, tone: "text-warning", text: "Paragraph 2 tells rather than shows. Add a concrete detail." },
  { icon: Lightbulb, tone: "text-brand-violet", text: "Tie your robotics project back to your intended major." },
];

export function AIShowcase() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><Sparkles className="size-3.5 text-primary" /> AI that actually understands admissions</>}
          title="Feedback like a top counselor — instantly"
          description="Trained on millions of admitted profiles and essay rubrics, AdmitFlow gives you the kind of guidance most students pay thousands for."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="space-y-6">
              {[
                {
                  title: "Calibrated chance estimates",
                  body: "Not vague advice — a real probability for every school, computed from your profile against historical admit data.",
                },
                {
                  title: "Line-level essay feedback",
                  body: "Highlights what's working, flags weak spots and suggests sharper phrasing — without ever writing it for you.",
                },
                {
                  title: "Always-on, always personal",
                  body: "Your mentor remembers your GPA, scores, target schools and budget, so every answer is tailored to you.",
                },
              ].map((item, i) => (
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
            <div className="animated-border rounded-3xl">
              <div className="glass-strong rounded-[1.45rem] p-5 shadow-card">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wand2 className="size-4 text-brand-violet" /> Essay Feedback Engine
                </div>
                <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-4 text-sm leading-relaxed text-foreground/80">
                  <p>
                    <mark className="rounded bg-success/20 px-1 text-foreground decoration-clone">The lab went dark at 2am</mark>{" "}
                    and my robot still wouldn&apos;t turn. I had rebuilt the circuit four times.{" "}
                    <mark className="rounded bg-warning/20 px-1 text-foreground decoration-clone">
                      I felt frustrated and tired that night.
                    </mark>{" "}
                    But something kept me there...
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
                  <span className="text-sm font-medium">Essay strength</span>
                  <span className="font-display text-sm font-bold text-success">Good → improving</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
