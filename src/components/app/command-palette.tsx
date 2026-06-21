"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  CornerDownLeft,
  ArrowRight,
  Sparkles,
  Plus,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { allNav } from "@/components/app/nav-config";
import { searchUniversities } from "@/lib/supabase/universities";
import { useT } from "@/lib/i18n";
import type { University } from "@/lib/types";

const quickActions = [
  { id: "ask", key: "cmd.ask", icon: Sparkles, href: "/mentor" },
  { id: "add-uni", key: "cmd.addUni", icon: Plus, href: "/universities" },
  { id: "roadmap", key: "cmd.roadmap", icon: ArrowRight, href: "/roadmap" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const { t } = useT();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [unis, setUnis] = useState<University[]>([]);

  // University suggestions come from Supabase (search_universities RPC), debounced.
  useEffect(() => {
    if (!open) return;
    let active = true;
    const id = setTimeout(async () => {
      const res = await searchUniversities({ q: search.trim() || undefined, limit: 6 });
      if (active) setUnis(res);
    }, 200);
    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [search, open]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-xl overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">{t("cmd.title")}</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder={t("cmd.placeholder")}
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[22rem] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              {t("cmd.noResults")}
            </Command.Empty>

            <Command.Group heading={t("cmd.quickActions")}>
              {quickActions.map((a) => (
                <Item key={a.id} onSelect={() => go(a.href)}>
                  <a.icon className="size-4 text-primary" />
                  {t(a.key)}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading={t("cmd.navigate")}>
              {allNav.map((n) => (
                <Item key={n.href} onSelect={() => go(n.href)}>
                  <n.icon className="size-4 text-muted-foreground" />
                  {t(n.key)}
                </Item>
              ))}
            </Command.Group>

            {unis.length > 0 && (
              <Command.Group heading={t("app.universities")}>
                {unis.map((u) => (
                  // value includes the live search text so server-matched rows are
                  // never hidden by cmdk's own client-side filtering.
                  <Item
                    key={u.id}
                    value={`${u.name} ${u.shortName} ${u.country} ${search}`}
                    onSelect={() => go(`/universities/${u.id}`)}
                  >
                    <span className="text-base">{u.flag}</span>
                    <span className="flex-1">{u.shortName}</span>
                    <span className="text-xs text-muted-foreground">{u.country}</span>
                  </Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading={t("cmd.preferences")}>
              <Item onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                {resolvedTheme === "dark" ? <Sun className="size-4 text-muted-foreground" /> : <Moon className="size-4 text-muted-foreground" />}
                {t("cmd.toggleTheme")}
              </Item>
              <Item onSelect={() => go("/")}>
                <LogOut className="size-4 text-muted-foreground" />
                {t("common.signOut")}
              </Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CornerDownLeft className="size-3" /> {t("cmd.toSelect")}
            </span>
            <span>AdmitFlow Command</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  children,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  value?: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
    >
      {children}
    </Command.Item>
  );
}
