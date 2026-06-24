"use client";

import { Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { useT } from "@/lib/i18n";

/** Localized hero for the /pricing page (eyebrow, gradient heading, subtitle). */
export function PricingHero() {
  const { t } = useT();
  return (
    <div className="relative mx-auto max-w-3xl px-6 text-center">
      <Reveal>
        <Eyebrow>
          <Sparkles className="size-3.5 text-primary" /> {t("pricing.eyebrow")}
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="mt-8 font-display text-[3.1rem] font-medium leading-[1.02] tracking-[-0.032em] text-balance sm:text-[4.5rem]">
          {t("pricingHero.titleLead")}{" "}
          <span className="bg-[linear-gradient(100deg,#4F7CFF,#7AA2FF)] bg-clip-text italic text-transparent">
            {t("pricingHero.titleAccent")}
          </span>
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-7 max-w-xl text-lg text-muted-foreground text-pretty">{t("pricingHero.subtitle")}</p>
      </Reveal>
    </div>
  );
}
