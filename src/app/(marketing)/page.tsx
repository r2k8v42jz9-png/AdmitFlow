import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { AIShowcase } from "@/components/marketing/ai-showcase";
import { StatsBand } from "@/components/marketing/stats-band";
import { RoadmapPreview } from "@/components/marketing/roadmap-preview";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <AIShowcase />
      <StatsBand />
      <RoadmapPreview />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTA />
    </>
  );
}
