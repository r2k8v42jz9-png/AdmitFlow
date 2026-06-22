"use client";

import { AnimatedNumber } from "@/components/shared/animated-number";
import { StaggerContainer, StaggerItem } from "@/components/shared/reveal";
import { heroStats } from "@/lib/data/marketing";
import { useT } from "@/lib/i18n";

export function StatsBand() {
  const { t } = useT();
  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-8 backdrop-blur-sm sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.15),transparent_60%)]" />
          <StaggerContainer className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {heroStats.map((s) => (
              <StaggerItem key={s.key} className="text-center">
                <div className="font-display text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
                  <AnimatedNumber
                    value={s.value}
                    decimals={s.value % 1 !== 0 ? 1 : 0}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t(`stat.${s.key}`)}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
