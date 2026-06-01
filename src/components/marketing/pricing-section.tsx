"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/data/marketing";
import { getUserState, setSubscription, type Plan } from "@/lib/user-store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PricingSection({ withHeading = true }: { withHeading?: boolean }) {
  const router = useRouter();
  const { t } = useT();
  const [yearly, setYearly] = useState(true);

  const onSelect = (tierId: string) => {
    if (!getUserState().authenticated) {
      router.push("/login");
      return;
    }
    // Mark the subscription active (the DB write is the source of truth).
    // NOTE: real checkout (Pricing → Checkout → Payment → Success → Dashboard)
    // is a separate billing batch; selecting a plan currently activates directly.
    setSubscription(tierId as Plan, true);
    import("@/lib/supabase/config").then(({ isSupabaseConfigured }) => {
      if (isSupabaseConfigured()) {
        import("@/lib/supabase/data").then(({ savePlan }) => savePlan(tierId as Plan, "active"));
      }
    });
    router.push("/dashboard");
  };

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {withHeading && (
          <SectionHeading
            eyebrow={<><Sparkles className="size-3.5 text-primary" /> {t("pricing.eyebrow")}</>}
            title={t("pricing.heading")}
            description={t("pricing.description")}
          />
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label={t("pricing.yearly")}
            onClick={() => setYearly((v) => !v)}
            className="inline-flex items-center gap-3"
          >
            <span className={cn("text-sm transition-colors", !yearly ? "text-foreground" : "text-muted-foreground")}>
              {t("pricing.monthly")}
            </span>
            {/* Flex track: items-center handles vertical centering; thumb travels
                exactly track-width − thumb − 2×inset = 48 − 20 − 4 = 24px. */}
            <span
              className={cn(
                "flex h-7 w-12 shrink-0 items-center rounded-full border p-0.5 transition-colors",
                yearly ? "border-primary/40 bg-primary/20" : "border-border/70 bg-card/60",
              )}
            >
              <span
                className={cn(
                  "size-5 rounded-full bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] shadow transition-transform duration-200",
                  yearly ? "translate-x-6" : "translate-x-0",
                )}
              />
            </span>
            <span className={cn("text-sm transition-colors", yearly ? "text-foreground" : "text-muted-foreground")}>
              {t("pricing.yearly")}
            </span>
          </button>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">{t("pricing.save")}</span>
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
                        {t("pricing.popular")}
                      </span>
                    </>
                  )}

                  <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                  <p className="mt-1 min-h-[4rem] text-sm text-muted-foreground">{tier.tagline}</p>

                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-bold tabular-nums tracking-tight">${price}</span>
                    <span className="mb-1 text-sm text-muted-foreground">{t("pricing.perMonth")}</span>
                  </div>
                  <p className="mt-1 h-4 text-xs text-muted-foreground">
                    {yearly ? t("pricing.billedAnnually") : t("pricing.billedMonthly")}
                  </p>

                  <Button
                    variant={tier.highlight ? "gradient" : "outline"}
                    size="lg"
                    className="mt-6 w-full"
                    onClick={() => onSelect(tier.id)}
                  >
                    {t(`plan.${tier.id}.cta`)}
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
