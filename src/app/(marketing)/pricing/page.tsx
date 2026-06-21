import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing-section";
import { PricingHero } from "@/components/marketing/pricing-hero";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { AuroraBackground } from "@/components/shared/aurora-background";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for AdmitFlow — Free, Pro and Max plans.",
};

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-4 sm:pt-44">
        <AuroraBackground variant="subtle" />
        <PricingHero />
      </section>

      <PricingSection withHeading={false} />

      <PlanComparison />

      <FAQ />
      <CTA />
    </>
  );
}
