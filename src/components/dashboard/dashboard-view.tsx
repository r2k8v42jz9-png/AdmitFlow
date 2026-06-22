"use client";

import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Building2,
  Flame,
  ArrowRight,
  Target,
  GraduationCap,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { EmptyState } from "@/components/shared/empty-state";
import { PlanStatusCard } from "@/components/dashboard/plan-status-card";
import { AmbientLayer } from "@/components/shared/ambient-layer";
import { AdmissionSummary } from "@/components/dashboard/admission-summary";
import { ApplicationProgress } from "@/components/dashboard/application-progress";
import { useUser, deriveProfile } from "@/lib/user-store";
import { useSavedUniversityDetails } from "@/lib/saved-universities";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const user = useUser();
  const { t } = useT();
  const { firstName, admissionScore, profileCompletion } = deriveProfile(user);
  const o = user.onboarding;

  // Everything below is derived ONLY from the user's real Supabase-backed data.
  const hasAcademics = o?.gpa != null || o?.ielts != null || o?.sat != null;

  // The universities the user has SAVED (user_universities-backed), with details
  // loaded from Supabase. Same source the roadmap reads, so the dashboard target
  // count and the roadmap always agree and update together.
  const { universities: myUniversities } = useSavedUniversityDetails();

  const avgFit = myUniversities.length
    ? Math.round(myUniversities.reduce((a, u) => a + u.fitScore, 0) / myUniversities.length)
    : null;

  const stats = [
    {
      label: t("dash.stat.admission"),
      value: hasAcademics ? String(admissionScore) : "—",
      icon: TrendingUp,
      tone: "text-success",
      accent: "from-success/20 to-transparent",
    },
    {
      // Real count of the user's target universities (their onboarding picks).
      // This is NOT "applications" — there is no applications table yet, so an
      // application count would always be 0. We show the truthful target count
      // and label it accordingly to avoid an inconsistent metric.
      label: t("dash.stat.targets"),
      value: String(myUniversities.length),
      icon: Building2,
      tone: "text-brand-blue",
      accent: "from-brand-blue/20 to-transparent",
    },
    {
      label: t("dash.stat.fit"),
      value: avgFit != null ? String(avgFit) : "—",
      icon: Target,
      tone: "text-brand-violet",
      accent: "from-brand-violet/20 to-transparent",
    },
    {
      label: t("dash.stat.streak"),
      value: String(user.streak.count),
      icon: Flame,
      tone: "text-warning",
      accent: "from-warning/20 to-transparent",
    },
  ];

  const profileChecklist = [
    { label: t("pf.check.academics"), done: o?.gpa != null },
    { label: t("pf.check.tests"), done: o?.ielts != null || o?.sat != null },
    { label: t("pf.check.extracurriculars"), done: (o?.strengths?.length ?? 0) > 0 },
    { label: t("pf.check.statement"), done: false },
    { label: t("pf.check.recommendations"), done: false },
  ];

  return (
    <>
      {/* Ambient wash — full viewport, 4% opacity, behind all cards. Static
          (reduced-motion safe); never affects layout. */}
      <AmbientLayer
        light="/assets/ambient/dashboard/dashboard-light.webp"
        dark="/assets/ambient/dashboard/dashboard-dark.webp"
        className="fixed inset-0 -z-10 opacity-[0.04]"
      />
      <PageContainer>
        <PageHeader
        title={
          <>
            {t("dash.welcome", { name: firstName })} <span className="align-middle text-2xl">👋</span>
          </>
        }
        description={t("dash.subtitle")}
        actions={
          <>
            <Button asChild variant="glass">
              <Link href="/universities">
                <Building2 className="size-4" /> {t("dash.explore")}
              </Link>
            </Button>
            <Button asChild variant="gradient">
              <Link href="/mentor">
                <Sparkles className="size-4" /> {t("dash.askMentor")}
              </Link>
            </Button>
          </>
        }
      />

      {/* Stat cards — show "—" when the underlying data doesn't exist yet */}
      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_16px_44px_-24px_hsl(230_50%_2%/0.9)]"
          >
            <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-200 group-hover:opacity-70", s.accent)} />
            <CardContent className="relative p-5">
              <span className={cn("grid size-9 place-items-center rounded-lg bg-background/60 ring-1 ring-inset ring-border/50", s.tone)}>
                <s.icon className="size-[18px]" />
              </span>
              <p className="mt-4 text-[1.75rem] font-bold tabular-nums tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left / main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Admission score — only meaningful once academics exist */}
          <Card>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing value={hasAcademics ? admissionScore : 0} label={t("onb.admission")} gradientId="dash-ring" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{t("dash.scoreTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasAcademics ? t("dash.scoreSub") : t("dash.scoreSubEmpty")}
                </p>
                {!hasAcademics && (
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/onboarding?edit=1">{t("empty.profile.cta")}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application progress — real stage tracker */}
          <ApplicationProgress />

          {/* Admission probability summary (gated for free) */}
          <AdmissionSummary />

          {/* My universities — the real list the user selected, or an empty state */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-primary" /> {t("dash.myList")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className={myUniversities.length ? "grid gap-3 sm:grid-cols-3" : ""}>
              {myUniversities.length ? (
                myUniversities.map((u) => (
                  <Link
                    key={u.id}
                    href={`/universities/${u.id}`}
                    className="group flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-card/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{u.flag}</span>
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                        {u.fitScore} fit
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold">{u.shortName}</p>
                    <p className="text-xs text-muted-foreground">{u.city}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {t("dash.viewDetails")} <ArrowRight className="size-3" />
                    </span>
                  </Link>
                ))
              ) : (
                <EmptyState
                  icon={Building2}
                  title={t("empty.universities.title")}
                  body={t("empty.universities.body")}
                  ctaLabel={t("empty.universities.cta")}
                  ctaHref="/universities"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right / aside */}
        <div className="space-y-6">
          {/* Plan / trial status */}
          <PlanStatusCard />

          {/* Profile completion — real, from deriveProfile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("dash.completion")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative grid size-14 shrink-0 place-items-center">
                  <svg className="size-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle
                      cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 24}
                      strokeDashoffset={2 * Math.PI * 24 * (1 - profileCompletion / 100)}
                    />
                  </svg>
                  <span className="absolute text-sm font-bold">{profileCompletion}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{t("dash.completionSub")}</p>
              </div>
              <ul className="space-y-2">
                {profileChecklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "grid size-4 place-items-center rounded-full text-[10px]",
                        c.done ? "bg-success/20 text-success" : "border border-border text-transparent",
                      )}
                    >
                      ✓
                    </span>
                    <span className={cn(c.done ? "text-muted-foreground line-through" : "text-foreground/90")}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/profile">{t("dash.completeProfile")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Deadlines — no mock data; empty until a roadmap exists */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{t("dash.deadlines")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="py-4 text-center text-xs text-muted-foreground">{t("empty.deadlines")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      </PageContainer>
    </>
  );
}
