"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/data/marketing";
import { getUserState, setPlan, type Plan } from "@/lib/user-store";
import { cn } from "@/lib/utils";

export function PricingSection({ withHeading = true }: { withHeading?: boolean }) {
  const router = useRouter();
  const [yearly, setYearly] = useState(true);

  const onSelect = (tierId: string) => {
    if (!getUserState().authenticated) {
      router.push("/signup");
      return;
    }
    setPlan(tierId as Plan);
    // Persist plan selection to the database when Supabase is configured.
    // NOTE: real checkout (Pricing → Checkout → Payment → Success → Dashboard)
    // is implemented in the billing batch; this currently grants access directly.
    import("@/lib/supabase/config").then(({ isSupabaseConfigured }) => {
      if (isSupabaseConfigured()) {
        import("@/lib/supabase/profiles").then(({ persistPlan }) => persistPlan(tierId as Plan, true));
      }
    });
    router.push("/dashboard");
  };

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {withHeading && (
          <SectionHeading
            eyebrow={<><Sparkles className="size-3.5 text-primary" /> Simple, transparent pricing</>}
            title="Invest in your future, not in stress"
            description="Pick the plan that matches your timeline. Upgrade or cancel anytime — every plan pays for itself with one scholarship."
          />
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={cn("text-sm transition-colors", !yearly ? "text-foreground" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={cn(
              "relative h-7 w-12 rounded-full border border-border/70 bg-card/60 transition-colors",
              yearly && "bg-primary/20 border-primary/40",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] shadow transition-transform",
                yearly ? "translate-x-[1.45rem]" : "translate-x-0.5",
              )}
            />
          </button>
          <span className={cn("text-sm transition-colors", yearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly
          </span>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Save 20%</span>
        </div>

        <StaggerContainer className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const price = yearly ? tier.price.yearly : tier.price.monthly;
            return (
              <StaggerItem key={tier.id} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-7",
                    tier.highlight
                      ? "border-primary/40 bg-card/70 shadow-[0_24px_70px_-30px_hsl(var(--primary)/0.6)]"
                      : "border-border/70 bg-card/40",
                  )}
                >
                  {tier.highlight && (
                    <>
                      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.14),transparent_60%)]" />
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(110deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] px-3 py-1 text-xs font-semibold text-white shadow">
                        {tier.badge}
                      </span>
                    </>
                  )}

                  <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                  <p className="mt-1 min-h-[4rem] text-sm text-muted-foreground">{tier.tagline}</p>

                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-4xl font-bold tracking-tight">${price}</span>
                    <span className="mb-1 text-sm text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-1 h-4 text-xs text-muted-foreground">
                    {yearly ? "billed annually" : "billed monthly"}
                  </p>

                  <Button
                    variant={tier.highlight ? "gradient" : "outline"}
                    size="lg"
                    className="mt-6 w-full"
                    onClick={() => onSelect(tier.id)}
                  >
                    {tier.cta}
                  </Button>

                  <ul className="mt-7 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                            tier.highlight ? "bg-primary/20 text-primary" : "bg-muted text-foreground/70",
                          )}
                        >
                          <Check className="size-3" />
                        </span>
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
