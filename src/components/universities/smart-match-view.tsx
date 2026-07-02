"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, Rocket, ShieldCheck, Sparkles, Target as TargetIcon, Telescope, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityCard } from "@/components/universities/university-card";
import { useSavedUniversities } from "@/lib/saved-universities";
import { useUser } from "@/lib/user-store";
import { getUniversitiesByIds } from "@/lib/supabase/universities";
import { fetchUniversityMatches } from "@/lib/supabase/match-actions";
import { createCheckoutSession } from "@/lib/payments/lemonsqueezy";
import type { MatchClassification, UniversityMatch } from "@/lib/supabase/match";
import { useT } from "@/lib/i18n";
import type { University } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Cards beyond this index are blurred behind the Pro paywall. */
const FREE_MATCH_LIMIT = 3;

type FilterValue = MatchClassification | "all";

const FILTERS: { value: FilterValue; icon: typeof Sparkles; labelKey: string }[] = [
  { value: "all", icon: Sparkles, labelKey: "match.filter.all" },
  { value: "safety", icon: ShieldCheck, labelKey: "match.filter.safety" },
  { value: "target", icon: TargetIcon, labelKey: "match.filter.target" },
  { value: "reach", icon: Rocket, labelKey: "match.filter.reach" },
];

export function SmartMatchView() {
  const { t } = useT();
  const user = useUser();
  const { toggle, isSaved } = useSavedUniversities();

  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [checkingOut, setCheckingOut] = useState(false);

  // TODO: swap for useEntitlements().isPro (src/lib/entitlements.ts) once billing is wired up.
  const isPro = false;

  const handleUpgrade = async () => {
    if (checkingOut || !user.id) return;
    setCheckingOut(true);
    try {
      const { url } = await createCheckoutSession(user.id);
      window.location.href = url;
    } finally {
      setCheckingOut(false);
    }
  };

  const onboarding = user.onboarding;
  const hasProfile = !!(onboarding && (onboarding.gpa || onboarding.ielts || onboarding.intendedMajor));
  const excludedCount = onboarding?.excludeCountries?.length ?? 0;
  // Stable string key so the effect only re-runs when a scoring input actually changes.
  const profileKey = `${user.hydrated}|${hasProfile}|${onboarding?.gpa}|${onboarding?.gpaScale}|${onboarding?.ielts}|${onboarding?.intendedMajor}|${onboarding?.excludeCountries?.join(",")}`;

  useEffect(() => {
    if (!user.hydrated) return;
    if (!hasProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchUniversityMatches(60, 0, onboarding).then(async (m) => {
      if (!active) return;
      setMatches(m);
      const full = await getUniversitiesByIds(m.map((x) => x.universityId));
      if (!active) return;
      setUniversities(full);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  const matchById = new Map(matches.map((m) => [m.universityId, m]));
  const filtered = filter === "all" ? universities : universities.filter((u) => matchById.get(u.id)?.classification === filter);
  const countFor = (v: FilterValue) => (v === "all" ? matches.length : matches.filter((m) => m.classification === v).length);

  if (user.hydrated && !hasProfile) {
    return (
      <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Sparkles className="size-7" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold">{t("match.emptyProfile.title")}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("match.emptyProfile.body")}</p>
        <Button asChild variant="gradient" className="mt-5">
          <Link href="/profile">{t("dash.completeProfile")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t("match.subtitle")}</p>
        {excludedCount > 0 && (
          <Link href="/settings" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <SlidersHorizontal className="size-3.5" />
            {t("match.excludedNotice", { count: excludedCount })}
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/70 bg-card/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" /> {t(f.labelKey)}
              <span className={cn("text-xs", active ? "text-primary/80" : "text-muted-foreground/70")}>{countFor(f.value)}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-border/50 bg-card/40" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {(isPro ? filtered : filtered.slice(0, FREE_MATCH_LIMIT)).map((u, i) => {
                const m = matchById.get(u.id);
                return (
                  <UniversityCard
                    key={u.id}
                    university={u}
                    saved={isSaved(u.id)}
                    onToggleSave={toggle}
                    index={i}
                    classification={m?.classification}
                    matchScore={m?.matchScore}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Paywall — index FREE_MATCH_LIMIT+ renders blurred behind a centered upgrade CTA.
              Only a small teaser batch is actually rendered (not all remaining matches) so the
              CTA stays in view instead of centering somewhere far down a long blurred list. */}
          {!isPro && filtered.length > FREE_MATCH_LIMIT && (
            <div className="relative mt-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.slice(FREE_MATCH_LIMIT, FREE_MATCH_LIMIT + 6).map((u, i) => {
                  const m = matchById.get(u.id);
                  return (
                    <div key={u.id} className="blur-[4px] pointer-events-none select-none opacity-70">
                      <UniversityCard
                        university={u}
                        saved={isSaved(u.id)}
                        onToggleSave={toggle}
                        index={i + FREE_MATCH_LIMIT}
                        classification={m?.classification}
                        matchScore={m?.matchScore}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                <div className="max-w-sm rounded-2xl border border-border/70 bg-card/95 p-6 text-center shadow-xl backdrop-blur-sm">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Lock className="size-6" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-foreground">{t("match.paywall.title")}</p>
                  <Button variant="gradient" className="mt-4 w-full" onClick={handleUpgrade} disabled={checkingOut || !user.id}>
                    {checkingOut ? <Loader2 className="size-4 animate-spin" /> : t("match.paywall.cta")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Telescope className="size-7" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold">{t("match.noResults.title")}</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("match.noResults.body")}</p>
        </div>
      )}
    </div>
  );
}
