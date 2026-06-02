"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Check, Crown, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUser, deriveProfile, nameFromEmail } from "@/lib/user-store";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const notificationDefaults = [
  { id: "deadlines", label: "Deadline reminders", desc: "Get notified before application and scholarship deadlines.", on: true },
  { id: "ai", label: "AI suggestions", desc: "New recommendations and insights from your mentor.", on: true },
  { id: "digest", label: "Weekly digest", desc: "A Monday summary of your progress and next steps.", on: true },
  { id: "product", label: "Product updates", desc: "Occasional news about new AdmitFlow features.", on: false },
];

export function SettingsPanels() {
  const { theme, setTheme } = useTheme();
  const user = useUser();
  const { planLabel } = deriveProfile(user);
  const displayName = user.name || nameFromEmail(user.email) || "";
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(notificationDefaults);
  const [saved, setSaved] = useState(false);

  // Hydration guard for next-themes — set state after mount to avoid SSR mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const toggleNotif = (id: string) =>
    setNotifications((n) => n.map((item) => (item.id === id ? { ...item, on: !item.on } : item)));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Account */}
      <SettingsSection title="Account" description="Update your personal information.">
        <div key={displayName + user.email} className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input defaultValue={displayName} />
          </Field>
          <Field label="Email address">
            <Input type="email" defaultValue={user.email} />
          </Field>
          <Field label="Intended major">
            <Input defaultValue={user.onboarding?.intendedMajor ?? ""} />
          </Field>
          <Field label="Target intake">
            <Input defaultValue={user.onboarding?.targetIntake ?? ""} />
          </Field>
        </div>
        <Field label="Bio" className="mt-4">
          <Textarea defaultValue="" placeholder="Tell us about your goals…" rows={3} />
        </Field>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="gradient" onClick={save}>
            {saved ? (
              <>
                <Check className="size-4" /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance" description="Customize how AdmitFlow looks on your device.">
        <Label className="text-sm">Theme</Label>
        <div className="mt-2 grid max-w-md grid-cols-3 gap-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const active = mounted && theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground ring-2 ring-primary/20"
                    : "border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" description="Choose what you want to hear about.">
        <div className="divide-y divide-border/60">
          {notifications.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={item.on} onCheckedChange={() => toggleNotif(item.id)} />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Subscription */}
      <SettingsSection title="Subscription" description="Manage your plan and billing.">
        <div className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white shadow-glow">
              <Crown className="size-5" />
            </span>
            <div>
              <p className="flex items-center gap-2 font-medium">
                AdmitFlow {planLabel} <Badge variant="gradient">Current</Badge>
              </p>
              <p className="text-sm text-muted-foreground">Renews monthly · Unlimited AI mentor & roadmaps</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/pricing">Change plan</Link>
            </Button>
            {/* Premium Mentor is the top tier — no upgrade prompt. */}
            {user.plan !== "premium" && (
              <Button variant="gradient" asChild>
                <Link href="/pricing">
                  <Crown className="size-4" /> Upgrade
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Danger zone */}
      <Card className="border-destructive/30 p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold">Danger zone</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Separator className="my-4" />
            <Button variant="destructive">Delete account</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
