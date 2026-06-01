"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { DynamicIcon } from "@/components/shared/icon";
import { featureCards } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-primary" /> A complete admissions service</>}
          title={<>An entire admissions team,<br className="hidden sm:block" /> in your corner</>}
          description="From the first university search to your acceptance letter — every step is guided, measured and personalized to you."
        />

        <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((f) => (
            <StaggerItem key={f.title}>
              <SpotlightCard className="h-full p-6">
                <div
                  className={cn(
                    "mb-5 grid size-12 place-items-center rounded-xl bg-gradient-to-br text-foreground ring-1 ring-inset ring-border/60",
                    f.accent,
                  )}
                >
                  <DynamicIcon name={f.icon} className="size-5 text-foreground" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
