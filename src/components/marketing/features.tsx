"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { DynamicIcon } from "@/components/shared/icon";
import { featureCards } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Features() {
  const { t } = useT();
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={<><span className="size-1.5 rounded-full bg-primary" /> {t("features.eyebrow")}</>}
          title={t("features.title")}
          description={t("features.description")}
        />

        <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((f) => (
            <StaggerItem key={f.key}>
              <SpotlightCard className="h-full p-6">
                <div
                  className={cn(
                    "mb-5 grid size-12 place-items-center rounded-xl bg-gradient-to-br text-foreground ring-1 ring-inset ring-border/60",
                    f.accent,
                  )}
                >
                  <DynamicIcon name={f.icon} className="size-5 text-foreground" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight">{t(`feature.${f.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`feature.${f.key}.desc`)}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
