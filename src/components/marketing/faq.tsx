"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { faqs, faqsRu } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { t, locale } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const items = locale === "ru" ? faqsRu : faqs;

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-primary" /> {t("faq.eyebrow")}</>}
          title={t("faq.title")}
        />

        <div className="mt-12 space-y-3">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className={cn(
                    "rounded-2xl border bg-card/50 transition-colors",
                    isOpen ? "border-primary/40" : "border-border/70 hover:border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg border border-border/70 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-45 bg-primary/15 text-primary border-primary/30",
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
