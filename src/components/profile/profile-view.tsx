"use client";

import Link from "next/link";
import {
  GraduationCap,
  Languages,
  PenLine,
  Wallet,
  Globe2,
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Trophy,
  Heart,
  Pencil,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/shared/score-ring";
import { ProfileRadarChart } from "@/components/dashboard/charts";
import { universities } from "@/lib/data/universities";
import { useUser, deriveProfile, nameFromEmail } from "@/lib/user-store";
import { useT } from "@/lib/i18n";
import { formatCurrency, initials } from "@/lib/utils";

const checklistMeta = {
  done: { icon: CheckCircle2, className: "text-success", label: "Complete" },
  progress: { icon: Clock, className: "text-warning", label: "In progress" },
  pending: { icon: Circle, className: "text-muted-foreground", label: "To do" },
} as const;

const NOT_SET = "—";

export function ProfileView() {
  const user = useUser();
  const { t } = useT();
  const { admissionScore, profileCompletion, planLabel } = deriveProfile(user);
  const o = user.onboarding;

  const displayName = user.name || nameFromEmail(user.email) || "You";
  const major = o?.intendedMajor || NOT_SET;
  const intake = o?.targetIntake || NOT_SET;
  const streak = user.streak.count;

  const dreamNames = (o?.dreamUniversities ?? [])
    .map((id) => universities.find((u) => u.id === id))
    .filter((u): u is (typeof universities)[number] => !!u);

  const checklist = [
    { label: "Academic records & GPA", status: o?.gpa != null ? "done" : "pending" },
    { label: "Standardized test scores", status: o?.ielts != null || o?.sat != null ? "done" : "pending" },
    { label: "Extracurricular activities", status: (o?.strengths?.length ?? 0) > 0 ? "done" : "pending" },
    { label: "Target countries & intake", status: (o?.countries?.length ?? 0) > 0 && o?.targetIntake ? "done" : "progress" },
    { label: "Personal statement", status: "pending" },
    { label: "Letters of recommendation", status: "pending" },
  ] as const;

  return (
    <PageContainer>
      <PageHeader
        title={t("profile.title")}
        description={t("profile.description")}
        actions={
          <Button asChild variant="outline">
            <Link href="/onboarding?edit=1">
              <Pencil className="size-4" /> {t("profile.edit")}
            </Link>
          </Button>
        }
      />

      {/* Identity card */}
      <Card className="relative mt-7 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(110deg,hsl(var(--brand-blue)/0.2),hsl(var(--brand-violet)/0.18),hsl(var(--brand-pink)/0.15))]" />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-2 border-background shadow-card">
              <AvatarFallback className="text-xl">{initials(displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight">{displayName}</h2>
                <Badge variant="gradient">{planLabel}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Target className="size-3.5" /> {major}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" /> {intake}
                </span>
                <span className="inline-flex items-center gap-1.5 text-warning">
                  <Flame className="size-3.5" /> {streak}-day streak
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 rounded-2xl border border-border/50 bg-background/40 p-4">
            <ScoreRing value={admissionScore} size={96} stroke={8} label="Admit score" gradientId="profile-score" />
            <div className="text-sm">
              <p className="font-medium">Admission readiness</p>
              <p className="mt-0.5 max-w-[16rem] text-xs text-muted-foreground">
                A composite of your academics, test scores and profile strength.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold">Academics & scores</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailTile
                icon={GraduationCap}
                label="GPA"
                value={o?.gpa != null ? o.gpa.toFixed(2) : NOT_SET}
                sub={o?.gpa != null ? `/ ${o.gpaScale.toFixed(1)} scale` : undefined}
              />
              <DetailTile icon={Languages} label="IELTS" value={o?.ielts != null ? o.ielts.toFixed(1) : NOT_SET} sub="Band score" />
              <DetailTile icon={PenLine} label="SAT" value={o?.sat != null ? String(o.sat) : NOT_SET} sub="/ 1600" />
              <DetailTile icon={Target} label="Intended major" value={major} />
              <DetailTile icon={GraduationCap} label="Degree level" value={o?.degreeLevel || NOT_SET} />
              <DetailTile
                icon={Wallet}
                label="Annual budget"
                value={o?.budget != null ? formatCurrency(o.budget).replace(/\.00$/, "") : NOT_SET}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold">Study preferences</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Globe2 className="size-4 text-primary" /> Preferred countries
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {o?.countries?.length ? (
                    o.countries.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No countries selected yet.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Trophy className="size-4 text-primary" /> Extracurricular strengths
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {o?.strengths?.length ? (
                    o.strengths.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No strengths added yet.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="size-4 text-primary" /> Dream universities
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dreamNames.length ? (
                    dreamNames.map((u) => (
                      <Badge key={u.id} variant="secondary" className="gap-1.5">
                        <span>{u.flag}</span> {u.shortName}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No dream schools picked yet.</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: strength + completion */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Profile strength</h3>
              <span className="text-xs text-muted-foreground">6 dimensions</span>
            </div>
            <ProfileRadarChart />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Completion</h3>
              <span className="font-display text-sm font-bold tabular-nums">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="mt-3" />
            <ul className="mt-4 space-y-2.5">
              {checklist.map((item) => {
                const meta = checklistMeta[item.status];
                const Icon = meta.icon;
                return (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <Icon className={`size-4 shrink-0 ${meta.className}`} />
                    <span className={item.status === "done" ? "text-muted-foreground" : "text-foreground"}>
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Button variant="gradient" className="mt-5 w-full" asChild>
              <Link href="/mentor">
                <Sparkles className="size-4" /> Improve with AI Mentor
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/30 p-4">
      <Icon className="size-4 text-muted-foreground" />
      <p className="mt-2 font-display text-lg font-bold leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">
        {label}
        {sub && <span className="opacity-70"> · {sub}</span>}
      </p>
    </div>
  );
}
