"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Users,
  Globe2,
  TrendingUp,
  GraduationCap,
  CalendarClock,
  Sparkles,
  CheckCircle2,
  Wallet,
  Award,
  Send,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScoreRing } from "@/components/shared/score-ring";
import { admissionBand } from "@/components/universities/university-card";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useUser } from "@/lib/user-store";
import { formatCurrency, formatCompact, formatDate, relativeDeadline, cn } from "@/lib/utils";
import type { University } from "@/lib/types";

const toneClass: Record<string, string> = {
  ok: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  muted: "text-muted-foreground",
};

export function UniversityDetail({ university: u }: { university: University }) {
  const { isSaved, toggle } = useBookmarks();
  const { onboarding } = useUser();
  const saved = isSaved(u.id);
  const band = admissionBand(u.admissionProbability);

  return (
    <div className="space-y-6">
      <Link
        href="/universities"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to explorer
      </Link>

      {/* Hero */}
      <Card className="relative overflow-hidden">
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b opacity-60", u.accent)} />
        <div className="relative flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-border/60 bg-background/70 text-4xl shadow-card">
              {u.flag}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{u.name}</h1>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  #{u.rankWorld} world
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {u.city}, {u.country}
                </span>
                {u.website && (
                  <a
                    href={u.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:underline"
                  >
                    <Globe2 className="size-4" /> Visit website
                  </a>
                )}
              </p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">{u.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {u.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-border/50 bg-background/40 p-4">
            <ScoreRing value={u.admissionProbability} size={104} stroke={9} label="Your odds" gradientId={`odds-${u.id}`} />
            <div className="space-y-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", band.className)}>
                <TrendingUp className="size-3" /> {band.label}
              </span>
              <div className="flex flex-col gap-2 pt-1">
                <Button variant="gradient" size="sm">
                  <Send className="size-4" /> Start application
                </Button>
                <Button
                  variant={saved ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => toggle(u.id)}
                >
                  <Bookmark className={cn("size-4", saved && "fill-current text-primary")} />
                  {saved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickStat icon={Sparkles} label="AI fit score" value={`${u.fitScore}`} tone="text-success" />
        <QuickStat icon={TrendingUp} label="Acceptance" value={`${u.acceptanceRate}%`} />
        <QuickStat icon={Users} label="Students" value={formatCompact(u.studentCount)} />
        <QuickStat icon={Globe2} label="International" value={`${u.intlPercent}%`} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="tuition">Tuition & Aid</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="font-display text-lg font-semibold">Why students choose {u.shortName}</h3>
              <ul className="mt-4 space-y-3">
                {u.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-5 sm:grid-cols-4">
                <Stat label="World rank" value={`#${u.rankWorld}`} />
                <Stat label="National rank" value={`#${u.rankNational}`} />
                <Stat label="Living cost" value={`${formatCurrency(u.livingCost, u.currency).replace(/\.00$/, "")}/yr`} />
                <Stat label="Tuition" value={u.tuitionPerYear === 0 ? "Free" : `${formatCurrency(u.tuitionPerYear, u.currency).replace(/\.00$/, "")}/yr`} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <CalendarClock className="size-4 text-primary" /> Upcoming deadlines
              </h3>
              <ul className="mt-4 space-y-3">
                {u.deadlines.map((d) => {
                  const rel = relativeDeadline(d.date);
                  return (
                    <li key={d.round} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/30 p-3">
                      <div>
                        <p className="text-sm font-medium">{d.round}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(d.date)}</p>
                      </div>
                      <span className={cn("text-xs font-semibold", toneClass[rel.tone])}>{rel.label}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Programs */}
        <TabsContent value="programs">
          <Card className="divide-y divide-border/60">
            {u.programs.map((p) => (
              <div key={p.name} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.degree} · {p.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-13 sm:pl-0">
                  <Badge variant="muted">{p.degree}</Badge>
                  <span className="text-sm font-semibold tabular-nums">
                    {p.tuitionPerYear === 0 ? "Free" : `${formatCurrency(p.tuitionPerYear, u.currency).replace(/\.00$/, "")}/yr`}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* Admissions */}
        <TabsContent value="admissions">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="font-display text-lg font-semibold">Requirements vs. your profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                How your current academics stack up against {u.shortName}&apos;s typical admit.
              </p>
              <div className="mt-5 space-y-4">
                <RequirementRow label="GPA" yours={onboarding?.gpa ?? null} required={u.requirements.gpa} max={4} format={(v) => v.toFixed(2)} />
                <RequirementRow label="IELTS" yours={onboarding?.ielts ?? null} required={u.requirements.ielts} max={9} format={(v) => v.toFixed(1)} />
                {u.requirements.sat && (
                  <RequirementRow label="SAT" yours={onboarding?.sat ?? null} required={u.requirements.sat} max={1600} format={(v) => `${v}`} />
                )}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-5 sm:grid-cols-4">
                <Stat label="Essays" value={`${u.requirements.essays}`} />
                <Stat label="Recommendations" value={`${u.requirements.recommendations}`} />
                <Stat label="Acceptance rate" value={`${u.acceptanceRate}%`} />
                <Stat label="Admit odds" value={`${u.admissionProbability}%`} />
              </div>
            </Card>

            <Card className="flex flex-col items-center p-6 text-center">
              <h3 className="font-display text-lg font-semibold">Admission probability</h3>
              <ScoreRing
                value={u.admissionProbability}
                size={150}
                label="Your odds"
                gradientId={`adm-${u.id}`}
                className="my-3"
              />
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", band.className)}>
                <TrendingUp className="size-3.5" /> {band.label} school
              </span>
              <p className="mt-3 text-xs text-muted-foreground">
                Based on your GPA, test scores and profile strength against historical admit data.
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Tuition & Aid */}
        <TabsContent value="tuition">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Wallet className="size-4 text-primary" /> Annual cost
              </h3>
              <div className="mt-5 space-y-4">
                <CostRow label="Tuition" value={u.tuitionPerYear === 0 ? "Free" : formatCurrency(u.tuitionPerYear, u.currency).replace(/\.00$/, "")} />
                <CostRow label="Living cost" value={formatCurrency(u.livingCost, u.currency).replace(/\.00$/, "")} />
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-sm font-medium">Estimated total</span>
                  <span className="font-display text-lg font-bold">
                    {formatCurrency(u.tuitionPerYear + u.livingCost, u.currency).replace(/\.00$/, "")}
                    <span className="text-xs font-normal text-muted-foreground">/yr</span>
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Award className="size-4 text-primary" /> Scholarships & funding
              </h3>
              <div className="mt-4 space-y-3">
                {u.scholarships.map((s) => {
                  const rel = relativeDeadline(s.deadline);
                  return (
                    <div key={s.name} className="rounded-xl border border-border/50 bg-background/30 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{s.coverage}</p>
                        </div>
                        <Badge variant="gradient" className="shrink-0">
                          {s.amount}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Apply by {formatDate(s.deadline)}</span>
                        <span className={cn("font-semibold", toneClass[rel.tone])}>{rel.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="ai">
          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white shadow-glow">
                <Sparkles className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">AI Mentor insight</h3>
                  <Badge variant="gradient" className="text-[10px]">
                    Personalized
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{u.aiInsight}</p>
              </div>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-5">
              <Button variant="gradient" size="sm" asChild>
                <Link href="/mentor">
                  <Sparkles className="size-4" /> Ask the AI Mentor
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/roadmap">
                  <CalendarClock className="size-4" /> Build my roadmap
                </Link>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm"
    >
      <Icon className="size-4 text-muted-foreground" />
      <p className={cn("mt-2 text-xl font-bold tabular-nums tracking-tight", tone)}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-base font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function RequirementRow({
  label,
  yours,
  required,
  max,
  format,
}: {
  label: string;
  yours: number | null;
  required: number;
  max: number;
  format: (v: number) => string;
}) {
  const hasValue = yours != null;
  const meets = hasValue && yours >= required;
  const pct = hasValue ? Math.min((yours / max) * 100, 100) : 0;
  const reqPct = Math.min((required / max) * 100, 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="tabular-nums">{hasValue ? format(yours) : "—"}</span>
          <span className="text-muted-foreground">/ typ. {format(required)}</span>
          {hasValue &&
            (meets ? (
              <Check className="size-4 text-success" />
            ) : (
              <X className="size-4 text-warning" />
            ))}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            meets ? "bg-[linear-gradient(90deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))]" : "bg-warning",
          )}
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded bg-foreground/60"
          style={{ left: `${reqPct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
