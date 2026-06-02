import { redirect } from "next/navigation";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { AIShowcase } from "@/components/marketing/ai-showcase";
import { StatsBand } from "@/components/marketing/stats-band";
import { RoadmapPreview } from "@/components/marketing/roadmap-preview";
import { Testimonials } from "@/components/marketing/testimonials";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // Defensive: Supabase recovery/confirmation links can land on the Site URL
  // (this marketing root) with a `?code=` when the email's redirect target
  // isn't allow-listed. Forward it to the callback, which exchanges the code
  // for a session and continues to the password-reset page.
  const { code } = await searchParams;
  if (code) {
    redirect(`/auth/callback?next=${encodeURIComponent("/reset-password")}&code=${encodeURIComponent(code)}`);
  }

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
