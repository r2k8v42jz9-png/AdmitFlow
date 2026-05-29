"use client";

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
import { universities } from "@/lib/data/universities";

const quickActions = [
  { id: "ask", label: "Ask the AI Mentor", icon: Sparkles, href: "/mentor" },
  { id: "add-uni", label: "Add a university to your list", icon: Plus, href: "/universities" },
  { id: "roadmap", label: "Open my roadmap", icon: ArrowRight, href: "/roadmap" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-xl overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Search universities, pages, actions…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[22rem] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick actions">
              {quickActions.map((a) => (
                <Item key={a.id} onSelect={() => go(a.href)}>
                  <a.icon className="size-4 text-primary" />
                  {a.label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Navigate">
              {allNav.map((n) => (
                <Item key={n.href} onSelect={() => go(n.href)}>
                  <n.icon className="size-4 text-muted-foreground" />
                  {n.label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Universities">
              {universities.slice(0, 8).map((u) => (
                <Item key={u.id} value={`${u.name} ${u.shortName} ${u.country}`} onSelect={() => go(`/universities/${u.id}`)}>
                  <span className="text-base">{u.flag}</span>
                  <span className="flex-1">{u.shortName}</span>
                  <span className="text-xs text-muted-foreground">{u.country}</span>
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Preferences">
              <Item onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                {resolvedTheme === "dark" ? <Sun className="size-4 text-muted-foreground" /> : <Moon className="size-4 text-muted-foreground" />}
                Toggle theme
              </Item>
              <Item onSelect={() => go("/")}>
                <LogOut className="size-4 text-muted-foreground" />
                Sign out
              </Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CornerDownLeft className="size-3" /> to select
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
