import type { Metadata } from "next";
import { Check, Minus, Sparkles } from "lucide-react";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { Eyebrow } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for AdmitFlow — Starter, Pro and Premium Mentor plans.",
};

const comparison = [
  { label: "University recommendations", starter: "20", pro: "Unlimited", premium: "Unlimited" },
  { label: "AI mentor messages", starter: "50 / mo", pro: "Unlimited", premium: "Unlimited" },
  { label: "Personalized roadmap", starter: "Basic", pro: "Advanced", premium: "Advanced" },
  { label: "Deadline tracker", starter: true, pro: true, premium: true },
  { label: "Profile analysis & score", starter: true, pro: true, premium: true },
  { label: "Full university database", starter: false, pro: true, premium: true },
  { label: "Admission chance estimator", starter: false, pro: true, premium: true },
  { label: "Essay feedback engine", starter: false, pro: true, premium: true },
  { label: "Scholarship finder & alerts", starter: false, pro: true, premium: true },
  { label: "Application tracker", starter: false, pro: true, premium: true },
  { label: "1:1 human counselor", starter: false, pro: false, premium: true },
  { label: "Application & essay review", starter: false, pro: false, premium: true },
  { label: "Priority AI responses", starter: false, pro: false, premium: true },
  { label: "Interview preparation", starter: false, pro: false, premium: true },
  { label: "Visa & relocation guidance", starter: false, pro: false, premium: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string")
    return <span className="text-sm text-foreground/80">{value}</span>;
  return value ? (
    <Check className="mx-auto size-4 text-success" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/50" />
  );
}

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

      {/* Comparison table */}
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 backdrop-blur-sm">
            <div className="grid grid-cols-4 border-b border-border/70 bg-card/40 px-6 py-4 text-sm font-semibold">
              <span className="col-span-1">Compare plans</span>
              <span className="text-center">Starter<span className="block text-xs font-normal text-muted-foreground">$19/mo</span></span>
              <span className="text-center text-primary">Pro<span className="block text-xs font-normal text-muted-foreground">$49/mo</span></span>
              <span className="text-center">Premium<span className="block text-xs font-normal text-muted-foreground">$149/mo</span></span>
            </div>
            {comparison.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 items-center px-6 py-3.5 text-sm ${
                  i % 2 ? "bg-card/20" : ""
                }`}
              >
                <span className="text-foreground/85">{row.label}</span>
                <div className="text-center"><Cell value={row.starter} /></div>
                <div className="text-center"><Cell value={row.pro} /></div>
                <div className="text-center"><Cell value={row.premium} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
      <CTA />
    </>
  );
}
