"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Trophy,
  Sparkles,
  Target,
  Wallet,
  Globe2,
  BookOpen,
  Heart,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScoreRing } from "@/components/shared/score-ring";
import { searchUniversities, getUniversityFacets } from "@/lib/supabase/universities";
import type { University } from "@/lib/types";
import { useUser, saveOnboarding, setSubscription, type OnboardingData, type Plan } from "@/lib/user-store";
import { getPricingTiers } from "@/lib/data/marketing";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useT, type Locale, type TFunction } from "@/lib/i18n";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Persist onboarding to the database and RESOLVE only once the write lands.
 * Callers must await this before navigating, otherwise the proxy on the next
 * page reads a stale `onboarding_data.completed` and bounces back here.
 */
async function persistOnboardingRemote(data: OnboardingData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { saveOnboarding: save } = await import("@/lib/supabase/data");
  await save(data);
}

function parseNum(value: string): number | null {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function toOnboarding(d: Data): OnboardingData {
  return {
    degreeLevel: d.degree,
    intendedMajor: d.major,
    gpa: parseNum(d.gpa),
    gpaScale: parseFloat(d.scale) || 4.0,
    ielts: parseNum(d.ielts),
    sat: parseNum(d.sat),
    countries: d.countries,
    budget: d.budget,
    strengths: d.strengths,
    dreamUniversities: d.dreams,
    targetIntake: d.intake,
    excludeCountries: [],
  };
}

// Stored value stays stable (English, for the DB); only the display label is translated.
const degrees = [
  { value: "Bachelor's", key: "degree.bachelor" },
  { value: "Master's", key: "degree.master" },
  { value: "PhD", key: "degree.phd" },
];
const majors = ["Computer Science", "Engineering", "Business", "Data Science", "Medicine", "Economics", "Design", "Law"];
const strengthsList = [
  { value: "Research / publications", key: "strength.research" },
  { value: "Hackathons & competitions", key: "strength.hackathons" },
  { value: "Leadership roles", key: "strength.leadership" },
  { value: "Sports", key: "strength.sports" },
  { value: "Volunteering", key: "strength.volunteering" },
  { value: "Internships", key: "strength.internships" },
  { value: "Arts & music", key: "strength.arts" },
  { value: "Entrepreneurship", key: "strength.entrepreneurship" },
];

interface Data {
  degree: string;
  major: string;
  intake: string;
  gpa: string;
  scale: string;
  ielts: string;
  sat: string;
  countries: string[];
  budget: number;
  strengths: string[];
  dreams: string[];
}

const intakes = ["Fall 2026", "Spring 2027", "Fall 2027", "Spring 2028", "Fall 2028"];

const steps = [
  { id: "goal", icon: Target },
  { id: "academics", icon: GraduationCap },
  { id: "scores", icon: BookOpen },
  { id: "countries", icon: Globe2 },
  { id: "budget", icon: Wallet },
  { id: "strengths", icon: Trophy },
  { id: "dreams", icon: Heart },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { t, locale } = useT();
  const { hydrated, remoteResolved, authenticated, onboarded, onboarding } = useUser();
  const ready = hydrated && (remoteResolved || !isSupabaseConfigured());
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "generating" | "result" | "plan">("form");
  const [navigating, setNavigating] = useState(false);
  const [choosingPlan, setChoosingPlan] = useState<Plan | null>(null);
  // TEMPORARY diagnostic surface — shows the raw Supabase error on screen so it's
  // visible without opening devtools (Safari makes that awkward). Remove once
  // onboarding_data writes are confirmed reliable.
  const [saveError, setSaveError] = useState<string | null>(null);
  const persistPromiseRef = useRef<Promise<void> | null>(null);
  // University catalog + country facets for the picker steps, sourced from
  // Supabase (the data layer falls back to the bundled catalog internally).
  const [uniList, setUniList] = useState<University[]>([]);
  const [countryList, setCountryList] = useState<string[]>([]);
  const [data, setData] = useState<Data>({
    degree: "Bachelor's",
    major: "",
    intake: "",
    gpa: "",
    scale: "4.0",
    ielts: "",
    sat: "",
    countries: [],
    budget: 30000,
    strengths: [],
    dreams: [],
  });

  // Gate: must be a signed-in, verified user; never show onboarding twice unless editing.
  useEffect(() => {
    if (!ready) return;
    const editing = new URLSearchParams(window.location.search).get("edit") === "1";
    if (!authenticated) {
      router.replace("/login");
    } else if (onboarded && !editing) {
      // Already onboarded → let the proxy/AppGate cascade to pricing or dashboard.
      router.replace("/dashboard");
    }
  }, [ready, authenticated, onboarded, router]);

  // When editing, pre-fill the form with the saved profile.
  useEffect(() => {
    if (!hydrated || !onboarding) return;
    const editing = new URLSearchParams(window.location.search).get("edit") === "1";
    if (!editing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      degree: onboarding.degreeLevel || "Bachelor's",
      major: onboarding.intendedMajor || "",
      intake: onboarding.targetIntake || "",
      gpa: onboarding.gpa != null ? String(onboarding.gpa) : "",
      scale: onboarding.gpaScale ? String(onboarding.gpaScale) : "4.0",
      ielts: onboarding.ielts != null ? String(onboarding.ielts) : "",
      sat: onboarding.sat != null ? String(onboarding.sat) : "",
      countries: onboarding.countries ?? [],
      budget: onboarding.budget ?? 30000,
      strengths: onboarding.strengths ?? [],
      dreams: onboarding.dreamUniversities ?? [],
    });
  }, [hydrated, onboarding]);

  // Load the catalog + facets once for the picker steps.
  useEffect(() => {
    let active = true;
    searchUniversities({ limit: 100 }).then((u) => {
      if (active) setUniList(u);
    });
    getUniversityFacets().then((f) => {
      if (active) setCountryList(f.countries);
    });
    return () => {
      active = false;
    };
  }, []);

  const total = steps.length;
  const progress = phase === "result" || phase === "plan" ? 100 : ((step + (phase === "generating" ? 1 : 0)) / total) * 100;

  const update = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key: "countries" | "strengths" | "dreams", value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const next = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Final step: persist locally + remotely. Kick off the DB write now and
    // hold the promise; the result CTA awaits it before routing to /pricing.
    const mapped = toOnboarding(data);
    saveOnboarding(mapped);
    persistPromiseRef.current = persistOnboardingRemote(mapped);
    setPhase("generating");
    setTimeout(() => setPhase("result"), 2800);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Wait for the onboarding write to land, then enter the app. Capped at 8s so a
  // hung write can never leave the button permanently disabled.
  const goToDashboard = async () => {
    if (navigating) return;
    setNavigating(true);
    setSaveError(null);
    try {
      const mapped = toOnboarding(data);
      saveOnboarding(mapped);
      const timeout = new Promise((res) => setTimeout(res, 8000));
      await Promise.race([persistPromiseRef.current ?? persistOnboardingRemote(mapped), timeout]);
    } catch (err) {
      // Surfaced for debugging (e.g. RLS blocking the onboarding_data upsert, or
      // a missing column if a migration hasn't been run against this DB yet).
      const message = err instanceof Error ? err.message : String(err);
      console.error("[onboarding] failed to persist onboarding_data — completed may still be false", err);
      // Stay on this screen instead of navigating away, so the message below
      // is actually visible (a redirect would wipe it before it could be read).
      setSaveError(message);
      setNavigating(false);
      return;
    }
    // Full navigation so onboarding's own redirect effect can't race us back.
    window.location.assign("/dashboard");
  };

  // Plan selection (shown after the result). Free is always selectable — this is
  // a choice, not a paywall. Paid plans set the subscription locally + remotely.
  const choosePlan = async (planId: Plan) => {
    if (navigating || choosingPlan) return;
    setChoosingPlan(planId);
    // Local/optimistic only. subscriptions is read-only for clients (RLS,
    // 0005_secure_subscriptions.sql): the DB row is set exclusively by the
    // payment webhook via the service-role key after a real checkout.
    if (planId === "free") {
      setSubscription("free", false);
    } else {
      setSubscription(planId, true);
    }
    await goToDashboard();
  };

  const skip = goToDashboard;
  const finish = () => setPhase("plan");

  const recommendations = [...uniList]
    .filter((u) => data.countries.length === 0 || data.countries.includes(u.country))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);

  const Current = steps[step];

  if (!ready || !authenticated) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Logo />
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-8">
      {/* Premium ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-background" />
      <div className="pointer-events-none fixed -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.12),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.18),transparent_70%)]" />
      <div className="pointer-events-none fixed -left-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-cyan)/0.1),transparent_70%)] blur-2xl" />

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Logo />
        {phase === "form" && (
          <button
            type="button"
            onClick={skip}
            disabled={navigating}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            {t("onb.skip")}
          </button>
        )}
      </div>

      {saveError && (
        <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-semibold">Onboarding save failed (Supabase):</p>
          <p className="mt-1 break-words font-mono text-xs">{saveError}</p>
        </div>
      )}

      {/* Progress */}
      <div className="mt-7">
        {/* Labeled stepper (desktop) */}
        <div className="mb-4 hidden items-center sm:flex">
          {steps.map((s, i) => {
            const done = i < step || phase === "result";
            const active = i === step && phase === "form";
            return (
              <div key={s.id} className="flex flex-1 items-center last:flex-none">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary/50 text-primary shadow-[0_0_0_4px_hsl(var(--brand-blue)/0.12)]"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
                </span>
                {i < steps.length - 1 && (
                  <span className={cn("mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300", i < step || phase === "result" ? "bg-primary" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{phase === "result" ? t("onb.complete") : t("onb.step", { n: step + 1, total })}</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-indigo)),hsl(var(--brand-blue)),hsl(var(--brand-cyan)))]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.div
              key={Current.id}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-7 flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border/70 bg-card/60 text-primary">
                  <Current.icon className="size-6" />
                </span>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t(`onb.step.${Current.id}.title`)}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`onb.step.${Current.id}.subtitle`)}</p>
                </div>
              </div>

              <StepBody data={data} update={update} toggle={toggle} stepId={Current.id} t={t} uniList={uniList} countryList={countryList} />
            </motion.div>
          )}

          {phase === "generating" && <Generating key="gen" t={t} />}

          {phase === "result" && (
            <Result key="res" data={data} recommendations={recommendations} onContinue={finish} navigating={navigating} t={t} />
          )}

          {phase === "plan" && (
            <PlanSelect key="plan" onChoose={choosePlan} choosing={choosingPlan} t={t} locale={locale} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {phase === "form" && (
        <div className="flex items-center justify-between border-t border-border/60 pt-5">
          <Button variant="ghost" onClick={back} disabled={step === 0} className={cn(step === 0 && "opacity-0 pointer-events-none")}>
            <ArrowLeft className="size-4" /> {t("onb.back")}
          </Button>
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-muted",
                )}
              />
            ))}
          </div>
          <Button variant="gradient" onClick={next}>
            {step === total - 1 ? t("onb.generate") : t("onb.continue")} <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function StepBody({
  stepId,
  data,
  update,
  toggle,
  t,
  uniList,
  countryList,
}: {
  stepId: string;
  data: Data;
  update: (p: Partial<Data>) => void;
  toggle: (k: "countries" | "strengths" | "dreams", v: string) => void;
  t: TFunction;
  uniList: University[];
  countryList: string[];
}) {
  switch (stepId) {
    case "goal":
      return (
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label>{t("onb.degreeLevel")}</Label>
            <div className="grid grid-cols-3 gap-3">
              {degrees.map((d) => (
                <SelectCard key={d.value} active={data.degree === d.value} onClick={() => update({ degree: d.value })}>
                  {t(d.key)}
                </SelectCard>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label>{t("onb.intendedMajor")}</Label>
            <div className="flex flex-wrap gap-2.5">
              {majors.map((m) => (
                <Chip key={m} active={data.major === m} onClick={() => update({ major: m })}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label>{t("onb.targetIntake")}</Label>
            <div className="flex flex-wrap gap-2.5">
              {intakes.map((it) => (
                <Chip key={it} active={data.intake === it} onClick={() => update({ intake: it })}>
                  {it}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      );
    case "academics":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gpa">GPA</Label>
            <Input id="gpa" inputMode="decimal" value={data.gpa} onChange={(e) => update({ gpa: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("onb.gpaScale")}</Label>
            <div className="grid grid-cols-2 gap-3">
              {["4.0", "5.0"].map((s) => (
                <SelectCard key={s} active={data.scale === s} onClick={() => update({ scale: s })}>
                  {s}
                </SelectCard>
              ))}
            </div>
          </div>
          {data.gpa && (
            <p className="sm:col-span-2 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
              <Sparkles className="mr-1.5 inline size-4 text-primary" />
              {t("onb.gpaHint", { gpa: data.gpa, scale: data.scale })}
            </p>
          )}
        </div>
      );
    case "scores":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ielts">IELTS / TOEFL</Label>
            <Input id="ielts" value={data.ielts} onChange={(e) => update({ ielts: e.target.value })} placeholder="e.g. 7.5" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sat">SAT / GRE</Label>
            <Input id="sat" value={data.sat} onChange={(e) => update({ sat: e.target.value })} placeholder="e.g. 1520" />
          </div>
        </div>
      );
    case "countries":
      return (
        <div className="flex flex-wrap gap-2.5">
          {countryList.map((c) => (
            <Chip key={c} active={data.countries.includes(c)} onClick={() => toggle("countries", c)}>
              {data.countries.includes(c) && <Check className="size-3.5" />} {c}
            </Chip>
          ))}
        </div>
      );
    case "budget":
      return (
        <div className="space-y-7">
          <div className="text-center">
            <span className="text-4xl font-bold tabular-nums text-gradient">{formatCurrency(data.budget)}</span>
            <span className="text-sm text-muted-foreground"> {t("onb.perYear")}</span>
          </div>
          <Slider
            min={0}
            max={80000}
            step={1000}
            value={[data.budget]}
            onValueChange={([v]) => update({ budget: v })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$80,000+</span>
          </div>
          <p className="rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline size-4 text-primary" />
            {t("onb.budgetHint")}
          </p>
        </div>
      );
    case "strengths":
      return (
        <div className="flex flex-wrap gap-2.5">
          {strengthsList.map((s) => (
            <Chip key={s.value} active={data.strengths.includes(s.value)} onClick={() => toggle("strengths", s.value)}>
              {data.strengths.includes(s.value) && <Check className="size-3.5" />} {t(s.key)}
            </Chip>
          ))}
        </div>
      );
    case "dreams":
      return (
        <div className="grid max-h-[22rem] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {uniList.map((u) => {
            const active = data.dreams.includes(u.id);
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => toggle("dreams", u.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  active ? "border-primary/50 bg-primary/10" : "border-border/70 bg-card/40 hover:border-border",
                )}
              >
                <span className="text-xl">{u.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{u.shortName}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.country}</p>
                </div>
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {active && <Check className="size-3" />}
                </span>
              </button>
            );
          })}
        </div>
      );
    default:
      return null;
  }
}

function SelectCard({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
        active ? "border-primary/50 bg-primary/10 text-foreground" : "border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-primary/50 bg-primary/15 text-foreground"
          : "border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Generating({ t }: { t: TFunction }) {
  const lines = [t("onb.gen.1"), t("onb.gen.2"), t("onb.gen.3"), t("onb.gen.4"), t("onb.gen.5")];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative grid size-20 place-items-center">
        <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent,hsl(var(--brand-violet)),transparent)] [mask:radial-gradient(farthest-side,transparent_calc(100%-3px),#000_0)]" />
        <Sparkles className="size-8 text-primary animate-pulse-glow" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">{t("onb.gen.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("onb.gen.subtitle")}</p>
      <div className="mt-8 w-full max-w-sm space-y-3 text-left">
        {lines.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.45 }}
            className="flex items-center gap-3 text-sm"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.45, type: "spring" }}
              className="grid size-5 place-items-center rounded-full bg-success/15 text-success"
            >
              <Check className="size-3" />
            </motion.span>
            <span className="text-foreground/85">{l}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Result({
  data,
  recommendations,
  onContinue,
  navigating,
  t,
}: {
  data: Data;
  recommendations: University[];
  onContinue: () => void;
  navigating: boolean;
  t: TFunction;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <Check className="size-3.5" /> {t("onb.result.ready")}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {data.major ? t("onb.result.welcomeMajor", { major: data.major }) : t("onb.result.welcome")}
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("onb.result.subtitle")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/50 p-6">
          <ScoreRing value={74} label={t("onb.admission")} gradientId="onb-ring" />
          <p className="mt-2 text-xs text-muted-foreground">{t("onb.result.improves")}</p>
        </div>
        <div className="space-y-2.5">
          {recommendations.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3"
            >
              <span className="text-xl">{u.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{u.shortName}</p>
                <p className="truncate text-xs text-muted-foreground">{u.city}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-success">{u.fitScore}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("onb.result.fit")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="gradient" size="lg" onClick={onContinue} disabled={navigating}>
          {navigating ? <Loader2 className="size-4 animate-spin" /> : <>{t("onb.result.continue")} <ArrowRight className="size-4" /></>}
        </Button>
      </div>
    </motion.div>
  );
}

function PlanSelect({
  onChoose,
  choosing,
  t,
  locale,
}: {
  onChoose: (plan: Plan) => void;
  choosing: Plan | null;
  t: TFunction;
  locale: Locale;
}) {
  const tiers = getPricingTiers(locale === "ru" ? "ru" : "en");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <Check className="size-3.5" /> {t("onb.result.ready")}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("onb.plan.title")}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("onb.plan.subtitle")}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {tiers.map((tier) => {
          const isFree = tier.price.monthly === 0;
          const busy = choosing === tier.id;
          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5",
                tier.highlight ? "border-primary/50 bg-primary/[0.04]" : "border-border/70 bg-card/50",
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(110deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {t("onb.plan.recommended")}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold tabular-nums tracking-tight">${isFree ? 0 : tier.price.monthly}</span>
                {!isFree && <span className="mb-1 text-xs text-muted-foreground">{t("pricing.perMonth")}</span>}
              </div>
              <p className="mt-2 min-h-[2.5rem] text-xs text-muted-foreground">{tier.tagline}</p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {tier.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                    <Check className="mt-0.5 size-3 shrink-0 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "gradient" : "outline"}
                className="mt-4 w-full"
                onClick={() => onChoose(tier.id as Plan)}
                disabled={!!choosing}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : tier.cta}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">{t("onb.plan.note")}</p>
    </motion.div>
  );
}
