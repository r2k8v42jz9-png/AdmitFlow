import { redirect } from "next/navigation";
import { Hero } from "@/components/marketing/hero";
import { LogoBridge } from "@/components/marketing/logo-bridge";
import { AdmissionJourney } from "@/components/marketing/admission-journey";
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
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string }>;
}) {
  // Defensive: Supabase recovery/confirmation links can land on the Site URL
  // (this marketing root) when the email's redirect target isn't allow-listed.
  // Forward whichever auth params arrived (PKCE `code`, or email-link
  // `token_hash`+`type`) to the callback, which establishes the session and
  // continues to the password-reset page.
  const { code, token_hash, type } = await searchParams;
  if (code || token_hash) {
    const params = new URLSearchParams({ next: "/reset-password" });
    if (token_hash) {
      params.set("token_hash", token_hash);
      params.set("type", type ?? "recovery");
    } else if (code) {
      params.set("code", code);
    }
    redirect(`/auth/callback?${params.toString()}`);
  }

  return (
    <>
      <Hero />
      <LogoBridge />
      <AdmissionJourney />
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
