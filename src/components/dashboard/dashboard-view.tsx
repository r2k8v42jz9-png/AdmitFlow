"use client";

import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Building2,
  Flame,
  ArrowRight,
  Target,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/shared/score-ring";
import { AdmissionTrendChart } from "@/components/dashboard/charts";
import { ApplicationTracker } from "@/components/dashboard/application-tracker";
import { DeadlineList } from "@/components/dashboard/deadline-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { applications, savedUniversityIds } from "@/lib/data/app";
import { universities } from "@/lib/data/universities";
import { useUser, deriveProfile } from "@/lib/user-store";
import { cn } from "@/lib/utils";

const recommendations = universities
  .filter((u) => !applications.some((a) => a.universityId === u.id))
  .sort((a, b) => b.fitScore - a.fitScore)
  .slice(0, 3);

export function DashboardView() {
  const user = useUser();
  const { firstName, admissionScore, profileCompletion } = deriveProfile(user);
  const o = user.onboarding;

  const stats = [
    {
      label: "Admission score",
      value: String(admissionScore),
      delta: admissionScore >= 70 ? "Strong" : admissionScore >= 50 ? "Building" : "Getting started",
      icon: TrendingUp,
      tone: "text-success",
      accent: "from-success/20 to-transparent",
    },
    {
      label: "Active applications",
      value: String(applications.length),
      delta: "2 due soon",
      icon: Building2,
      tone: "text-brand-blue",
      accent: "from-brand-blue/20 to-transparent",
    },
    {
      label: "Avg. fit score",
      value: "86",
      delta: "Strong",
      icon: Target,
      tone: "text-brand-violet",
      accent: "from-brand-violet/20 to-transparent",
    },
    {
      label: "Day streak",
      value: String(user.streak.count),
      delta: user.streak.count > 1 ? "Keep it up" : "Welcome!",
      icon: Flame,
      tone: "text-warning",
      accent: "from-warning/20 to-transparent",
    },
  ];

  const profileChecklist = [
    { label: "Academic stats", done: o?.gpa != null },
    { label: "Test scores", done: o?.ielts != null || o?.sat != null },
    { label: "Extracurriculars", done: (o?.strengths?.length ?? 0) > 0 },
    { label: "Personal statement", done: false },
    { label: "Recommendation letters", done: false },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={
          <>
            Welcome back, {firstName} <span className="align-middle text-2xl">👋</span>
          </>
        }
        description="Here's where your applications stand and what to focus on next."
        actions={
          <>
            <Button asChild variant="glass">
              <Link href="/universities">
                <Building2 className="size-4" /> Explore
              </Link>
            </Button>
            <Button asChild variant="gradient">
              <Link href="/mentor">
                <Sparkles className="size-4" /> Ask AI Mentor
              </Link>
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="relative overflow-hidden">
            <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", s.accent)} />
            <CardContent className="relative p-5">
              <div className="flex items-center justify-between">
                <span className={cn("grid size-9 place-items-center rounded-lg bg-background/60", s.tone)}>
                  <s.icon className="size-[18px]" />
                </span>
                <span className={cn("text-xs font-medium", s.tone)}>{s.delta}</span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left / main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Admission score + trend */}
          <Card>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing value={admissionScore} label="Admission" gradientId="dash-ring" />
                <Badge variant="success" className="gap-1">
                  <TrendingUp className="size-3" /> Trending up
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold">Your admission score</h3>
                    <p className="text-sm text-muted-foreground">Based on your GPA, IELTS and SAT</p>
                  </div>
                </div>
                <div className="mt-3">
                  <AdmissionTrendChart />
                </div>
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-xs text-foreground/85">
                    <span className="font-medium">AI tip:</span> Draft your personal statement to unlock the next
                    +8 points. It&apos;s your biggest remaining lever.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Application tracker</CardTitle>
                <CardDescription>{applications.length} applications in progress</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/universities">
                  View all <ChevronRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ApplicationTracker limit={4} />
            </CardContent>
          </Card>

          {/* AI recommendations */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" /> Recommended for you
                </CardTitle>
                <CardDescription>High-fit universities you haven&apos;t added yet</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {recommendations.map((u) => (
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
                    View details <ArrowRight className="size-3" />
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right / aside */}
        <div className="space-y-6">
          {/* Profile completion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile completion</CardTitle>
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
                <p className="text-sm text-muted-foreground">
                  Complete your profile to improve recommendation accuracy.
                </p>
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
                <Link href="/profile">Complete profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Upcoming deadlines</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/roadmap">
                  All <ChevronRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-1">
              <DeadlineList limit={5} />
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            Saved {savedUniversityIds.length} universities ·{" "}
            <Link href="/universities" className="text-primary hover:underline">explore more</Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
