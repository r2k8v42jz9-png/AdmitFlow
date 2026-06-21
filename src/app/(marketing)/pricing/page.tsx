import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PricingSection } from "@/components/marketing/pricing-section";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { Eyebrow } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for AdmitFlow — Free, Premium (7-day trial) and Concierge plans.",
};

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-4 sm:pt-44">
        <AuroraBackground variant="subtle" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <Eyebrow>
              <Sparkles className="size-3.5 text-primary" /> Pricing
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              Plans that grow <span className="text-gradient">with your ambition</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              From your first shortlist to your final acceptance — pick the plan that matches your
              timeline. Upgrade or cancel anytime.
            </p>
          </Reveal>
        </div>
      </section>

      <PricingSection withHeading={false} />

      <PlanComparison />

      <FAQ />
      <CTA />
    </>
  );
}
