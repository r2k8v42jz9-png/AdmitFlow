"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScoreRing } from "@/components/shared/score-ring";
import { universities, countries } from "@/lib/data/universities";
import { useUser, saveOnboarding, type OnboardingData } from "@/lib/user-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn, formatCurrency } from "@/lib/utils";

/** Persist onboarding to the database when Supabase is configured (fire-and-forget). */
function persistOnboardingRemote(data: OnboardingData) {
  if (!isSupabaseConfigured()) return;
  import("@/lib/supabase/data").then(({ saveOnboarding: save }) => save(data));
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
  };
}

const degrees = ["Bachelor's", "Master's", "PhD"];
const majors = ["Computer Science", "Engineering", "Business", "Data Science", "Medicine", "Economics", "Design", "Law"];
const strengthsList = [
  "Research / publications",
  "Hackathons & competitions",
  "Leadership roles",
  "Sports",
  "Volunteering",
  "Internships",
  "Arts & music",
  "Entrepreneurship",
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
  { id: "goal", title: "What are you aiming for?", subtitle: "We'll tailor everything to your degree and field.", icon: Target },
  { id: "academics", title: "Your academic profile", subtitle: "Be honest — this powers your chance estimates.", icon: GraduationCap },
  { id: "scores", title: "Test scores", subtitle: "Add what you have. You can update these later.", icon: BookOpen },
  { id: "countries", title: "Where do you want to study?", subtitle: "Pick all the countries you'd consider.", icon: Globe2 },
  { id: "budget", title: "What's your yearly budget?", subtitle: "We'll factor in tuition, scholarships and living costs.", icon: Wallet },
  { id: "strengths", title: "What makes you stand out?", subtitle: "Select your strongest areas.", icon: Trophy },
  { id: "dreams", title: "Any dream universities?", subtitle: "We'll benchmark your profile against them.", icon: Heart },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { hydrated, remoteResolved, authenticated, emailVerified, onboarded, onboarding } = useUser();
  const ready = hydrated && (remoteResolved || !isSupabaseConfigured());
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "generating" | "result">("form");
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
    } else if (!emailVerified) {
      router.replace("/verify-email");
    } else if (onboarded && !editing) {
      // Already onboarded → let the proxy/AppGate cascade to pricing or dashboard.
      router.replace("/dashboard");
    }
  }, [ready, authenticated, emailVerified, onboarded, router]);

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

  const total = steps.length;
  const progress = phase === "result" ? 100 : ((step + (phase === "generating" ? 1 : 0)) / total) * 100;

  const update = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key: "countries" | "strengths" | "dreams", value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const next = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      const mapped = toOnboarding(data);
      saveOnboarding(mapped);
      persistOnboardingRemote(mapped);
      setPhase("generating");
      setTimeout(() => setPhase("result"), 2800);
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const skip = () => {
    const mapped = toOnboarding(data);
    saveOnboarding(mapped);
    persistOnboardingRemote(mapped);
    // Onboarding done but no active subscription yet → choose a plan.
    router.replace("/pricing");
  };

  const finish = () => {
    router.replace("/pricing");
  };

  const recommendations = [...universities]
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
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Logo />
        {phase === "form" && (
          <button
            type="button"
            onClick={skip}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip for now
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {phase === "result" ? "Complete" : `Step ${step + 1} of ${total}`}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)),hsl(var(--brand-pink)))]"
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
                  <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{Current.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{Current.subtitle}</p>
                </div>
              </div>

              <StepBody data={data} update={update} toggle={toggle} stepId={Current.id} />
            </motion.div>
          )}

          {phase === "generating" && <Generating key="gen" />}

          {phase === "result" && (
            <Result key="res" data={data} recommendations={recommendations} onContinue={finish} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {phase === "form" && (
        <div className="flex items-center justify-between border-t border-border/60 pt-5">
          <Button variant="ghost" onClick={back} disabled={step === 0} className={cn(step === 0 && "opacity-0 pointer-events-none")}>
            <ArrowLeft className="size-4" /> Back
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
            {step === total - 1 ? "Generate my plan" : "Continue"} <ArrowRight className="size-4" />
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
}: {
  stepId: string;
  data: Data;
  update: (p: Partial<Data>) => void;
  toggle: (k: "countries" | "strengths" | "dreams", v: string) => void;
}) {
  switch (stepId) {
    case "goal":
      return (
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label>Degree level</Label>
            <div className="grid grid-cols-3 gap-3">
              {degrees.map((d) => (
                <SelectCard key={d} active={data.degree === d} onClick={() => update({ degree: d })}>
                  {d}
                </SelectCard>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label>Intended major</Label>
            <div className="flex flex-wrap gap-2.5">
              {majors.map((m) => (
                <Chip key={m} active={data.major === m} onClick={() => update({ major: m })}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Label>Target intake</Label>
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
            <Label>GPA scale</Label>
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
              A {data.gpa}/{data.scale} GPA places you in a strong position for most target schools.
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
          {countries.map((c) => (
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
            <span className="font-display text-4xl font-bold text-gradient">{formatCurrency(data.budget)}</span>
            <span className="text-sm text-muted-foreground"> / year</span>
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
            With this budget, tuition-free options like ETH Zürich and TUM are well within reach.
          </p>
        </div>
      );
    case "strengths":
      return (
        <div className="flex flex-wrap gap-2.5">
          {strengthsList.map((s) => (
            <Chip key={s} active={data.strengths.includes(s)} onClick={() => toggle("strengths", s)}>
              {data.strengths.includes(s) && <Check className="size-3.5" />} {s}
            </Chip>
          ))}
        </div>
      );
    case "dreams":
      return (
        <div className="grid max-h-[22rem] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {universities.map((u) => {
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

function Generating() {
  const lines = [
    "Analyzing your academic profile",
    "Matching against 1,400+ universities",
    "Estimating admission probabilities",
    "Finding scholarships you qualify for",
    "Building your personalized roadmap",
  ];
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
      <h2 className="mt-6 font-display text-2xl font-bold">Crafting your admission plan…</h2>
      <p className="mt-1 text-sm text-muted-foreground">Our AI is analyzing your profile in real time.</p>
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
}: {
  data: Data;
  recommendations: typeof universities;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <Check className="size-3.5" /> Your plan is ready
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to AdmitFlow{data.major ? `, ${data.major} student` : ""}
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Based on your profile, here&apos;s your starting admission score and your best-fit universities.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/50 p-6">
          <ScoreRing value={74} label="Admission" gradientId="onb-ring" />
          <p className="mt-2 text-xs text-muted-foreground">Improves as you complete tasks</p>
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
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">fit</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="gradient" size="lg" onClick={onContinue}>
          Continue to plans <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
