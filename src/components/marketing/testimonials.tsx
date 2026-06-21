"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { t } = useT();
  // split into two rows for opposing marquees
  const rowA = testimonials.slice(0, 3);
  const rowB = testimonials.slice(3);

  return (
    <section id="testimonials" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-brand-pink" /> {t("testi.eyebrow")}</>}
          title={t("testi.title")}
          description={t("testi.description")}
        />
      </div>

      <div className="mt-14 space-y-5">
        <Marquee items={rowA} />
        <Marquee items={rowB} reverse />
      </div>
    </section>
  );
}

function Marquee({ items, reverse }: { items: typeof testimonials; reverse?: boolean }) {
  const { t } = useT();
  const doubled = [...items, ...items, ...items];
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className={cn("flex shrink-0 gap-5 pause-on-hover", reverse ? "animate-marquee-slow" : "animate-marquee")}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((item, i) => (
          <figure
            key={i}
            className="flex w-[340px] shrink-0 flex-col rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur-sm"
          >
            <Quote className="size-6 text-primary/50" />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
              &ldquo;{t(`testi.${item.key}.quote`)}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                  item.accent,
                )}
              >
                {item.avatar}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{t(`testi.${item.key}.role`)}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
