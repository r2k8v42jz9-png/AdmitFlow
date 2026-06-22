"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Check, Crown, ShieldAlert, Loader2, LogOut, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUser, nameFromEmail, signOut, setSubscription, type Plan } from "@/lib/user-store";
import { useEntitlements, type Tier } from "@/lib/entitlements";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useT, type TFunction } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SettingsPanels() {
  const { theme, setTheme } = useTheme();
  const { t } = useT();
  const user = useUser();
  const displayName = user.name || nameFromEmail(user.email) || "";
  const [mounted, setMounted] = useState(false);

  const themeOptions = [
    { value: "light", label: t("settings.theme.light"), icon: Sun },
    { value: "dark", label: t("settings.theme.dark"), icon: Moon },
    { value: "system", label: t("settings.theme.system"), icon: Monitor },
  ];

  const notificationDefaults = [
    { id: "deadlines", label: t("settings.notif.deadlines"), desc: t("settings.notif.deadlines.desc"), on: true },
    { id: "ai", label: t("settings.notif.ai"), desc: t("settings.notif.ai.desc"), on: true },
    { id: "digest", label: t("settings.notif.digest"), desc: t("settings.notif.digest.desc"), on: true },
    { id: "product", label: t("settings.notif.product"), desc: t("settings.notif.product.desc"), on: false },
  ];

  const [notifications, setNotifications] = useState(notificationDefaults);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Hydration guard for next-themes — set state after mount to avoid SSR mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const toggleNotif = (id: string) =>
    setNotifications((n) => n.map((item) => (item.id === id ? { ...item, on: !item.on } : item)));

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (isSupabaseConfigured()) {
        const { signOutSupabase } = await import("@/lib/supabase/auth");
        await signOutSupabase();
      } else {
        signOut();
      }
    } catch {
      signOut();
    }
    window.location.assign("/");
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (isSupabaseConfigured()) {
        const { deleteAccount } = await import("@/lib/supabase/data");
        const res = await deleteAccount();
        if (!res.ok) throw new Error("delete_failed");
        const { signOutSupabase } = await import("@/lib/supabase/auth");
        await signOutSupabase();
      } else {
        signOut();
      }
      window.location.assign("/?deleted=1");
    } catch {
      setDeleting(false);
      setDeleteError("delete_failed");
    }
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Account */}
      <SettingsSection title={t("settings.account.title")} description={t("settings.account.desc")}>
        <div key={displayName + user.email} className="grid gap-4 sm:grid-cols-2">
          <Field label={t("settings.fullName")}>
            <Input defaultValue={displayName} />
          </Field>
          <Field label={t("settings.email")}>
            <Input type="email" defaultValue={user.email} />
          </Field>
          <Field label={t("settings.major")}>
            <Input defaultValue={user.onboarding?.intendedMajor ?? ""} />
          </Field>
          <Field label={t("settings.intake")}>
            <Input defaultValue={user.onboarding?.targetIntake ?? ""} />
          </Field>
        </div>
        <Field label={t("settings.bio")} className="mt-4">
          <Textarea defaultValue="" placeholder={t("settings.bioPlaceholder")} rows={3} />
        </Field>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="gradient" onClick={save}>
            {saved ? (
              <>
                <Check className="size-4" /> {t("settings.saved")}
              </>
            ) : (
              t("settings.save")
            )}
          </Button>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title={t("settings.appearance.title")} description={t("settings.appearance.desc")}>
        <Label className="text-sm">{t("settings.theme")}</Label>
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
      <SettingsSection title={t("settings.notifications.title")} description={t("settings.notifications.desc")}>
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
      <SettingsSection title={t("settings.subscription.title")} description={t("settings.subscription.desc")}>
        <SubscriptionPanel t={t} />
      </SettingsSection>

      {/* Session */}
      <SettingsSection title={t("settings.session.title")} description={t("settings.session.desc")}>
        <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />} {t("common.signOut")}
        </Button>
      </SettingsSection>

      {/* Danger zone */}
      <Card className="border-destructive/30 p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold">{t("settings.danger.title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("settings.danger.desc")}</p>
            <Separator className="my-4" />
            <Button variant="destructive" onClick={() => { setDeleteError(null); setConfirmOpen(true); }}>
              {t("settings.delete")}
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !deleting && setConfirmOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.delete.confirmTitle")}</DialogTitle>
            <DialogDescription>{t("settings.delete.confirmDesc")}</DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t("settings.delete.error")}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              {t("settings.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="size-4 animate-spin" /> : t("settings.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subscription management — view current plan, upgrade / downgrade, billing  */
/* -------------------------------------------------------------------------- */

const PLAN_META: { id: Plan; tier: Tier; name: string; price: string }[] = [
  { id: "free", tier: "free", name: "Free", price: "$0" },
  { id: "pro", tier: "pro", name: "Pro", price: "$7.99" },
  { id: "max", tier: "max", name: "Max", price: "$15" },
];

function SubscriptionPanel({ t }: { t: TFunction }) {
  const ent = useEntitlements();
  const [busy, setBusy] = useState<Plan | null>(null);

  const switchPlan = async (p: Plan) => {
    if (p === ent.tier || busy) return;
    setBusy(p);
    if (p === "free") setSubscription("free", false);
    else setSubscription(p, true);
    try {
      if (isSupabaseConfigured()) {
        const { savePlan } = await import("@/lib/supabase/data");
        await savePlan(p, p === "free" ? "canceled" : "active");
      }
    } catch {
      /* local store already reflects the change */
    }
    setBusy(null);
  };

  const order: Record<Tier, number> = { free: 0, pro: 1, max: 2 };
  const currentName = ent.isMax ? "Max" : ent.isPro ? "Pro" : "Free";
  const currentDesc = ent.isMax ? t("plan.subDesc.max") : ent.isPro ? t("plan.subDesc.pro") : t("plan.subDesc.free");

  return (
    <div className="space-y-4">
      {/* Current plan banner */}
      <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-white shadow-glow">
            <Crown className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 font-medium">
              AdmitFlow {currentName}
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">{t("plan.current")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentDesc}</p>
          </div>
        </div>
      </div>

      {/* Plan options — upgrade / downgrade */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PLAN_META.map((p) => {
          const isCurrent = p.tier === ent.tier;
          const isUpgrade = order[p.tier] > order[ent.tier];
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col rounded-xl border p-4",
                isCurrent ? "border-primary/50 bg-primary/[0.04]" : "border-border/70 bg-card/40",
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-base font-semibold">{p.name}</span>
                <span className="text-sm text-muted-foreground">
                  {p.price}
                  {p.id !== "free" && <span className="text-xs">{t("pricing.perMonth")}</span>}
                </span>
              </div>
              <Button
                variant={isCurrent ? "outline" : isUpgrade ? "gradient" : "outline"}
                size="sm"
                className="mt-3 w-full"
                disabled={isCurrent || !!busy}
                onClick={() => switchPlan(p.id)}
              >
                {busy === p.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isCurrent ? (
                  t("plan.current")
                ) : isUpgrade ? (
                  <>
                    <Sparkles className="size-4" /> {t("plan.upgrade")}
                  </>
                ) : (
                  t("plan.changePlan")
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">{t("plan.billingNote")}</p>
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
