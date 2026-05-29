"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, Sparkles, Crown } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mainNav, secondaryNav, type NavItem } from "@/components/app/nav-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col gap-2 p-3">
        {/* Brand */}
        <div className={cn("flex h-12 items-center", collapsed ? "justify-center" : "justify-between px-1")}>
          {collapsed ? (
            <Link href="/dashboard">
              <LogoMark className="size-9" />
            </Link>
          ) : (
            <Logo href="/dashboard" />
          )}
          {!collapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:grid"
              aria-label="Collapse sidebar"
            >
              <ChevronsLeft className="size-4" />
            </button>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex flex-col gap-1">
          {!collapsed && <SectionLabel>Menu</SectionLabel>}
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="my-1 h-px bg-border/70" />

        <nav className="flex flex-col gap-1">
          {!collapsed && <SectionLabel>Account</SectionLabel>}
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {collapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden size-9 place-items-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:grid"
              aria-label="Expand sidebar"
            >
              <ChevronsLeft className="size-4 rotate-180" />
            </button>
          )}
          {!collapsed && <UpgradeCard />}
        </div>
      </div>
    </TooltipProvider>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{children}</span>;
}

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 -z-10 rounded-lg border border-primary/30 bg-primary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className={cn("size-[18px] shrink-0", active && "text-primary")} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="rounded-md bg-[linear-gradient(110deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

function UpgradeCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card/60 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_70%)]" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
          <Crown className="size-3" /> Premium Mentor
        </span>
        <p className="mt-2.5 text-sm font-medium leading-snug">Get a dedicated human counselor</p>
        <p className="mt-1 text-xs text-muted-foreground">Essay & interview coaching, 1:1 sessions.</p>
        <Button asChild variant="gradient" size="sm" className="mt-3 w-full">
          <Link href="/pricing">
            <Sparkles className="size-3.5" /> Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
}
