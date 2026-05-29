"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  CircleCheckBig,
  CalendarClock,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { allNav } from "@/components/app/nav-config";
import { useUser, signOut, nameFromEmail } from "@/lib/user-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { initials } from "@/lib/utils";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  mentor: "AI Mentor",
  universities: "Universities",
  roadmap: "Roadmap",
  profile: "Profile",
  settings: "Settings",
};

const notifications = [
  { icon: CalendarClock, tone: "text-warning", title: "Oxford interview in 6 days", time: "Jun 4 · 10:00 AM", unread: true },
  { icon: Sparkles, tone: "text-primary", title: "New scholarship match found", time: "ETH ESOP · CHF 12,000", unread: true },
  { icon: CircleCheckBig, tone: "text-success", title: "Toronto application submitted", time: "2 hours ago", unread: false },
];

export function AppTopbar({
  onOpenCommand,
  onOpenMobileNav,
}: {
  onOpenCommand: () => void;
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { name, email, plan } = useUser();
  const displayName = name || nameFromEmail(email) || "You";
  const segments = pathname.split("/").filter(Boolean);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const { signOutSupabase } = await import("@/lib/supabase/auth");
      await signOutSupabase();
    } else {
      signOut();
    }
    router.push("/");
  };

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const navMatch = allNav.find((n) => n.href === href);
    const label = navMatch?.label ?? labelMap[seg] ?? decodeURIComponent(seg).replace(/-/g, " ");
    return { href, label };
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onOpenMobileNav}
        className="grid size-9 place-items-center rounded-lg border border-border/70 text-muted-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden items-center gap-1.5 text-sm sm:flex">
        <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
          AdmitFlow
        </Link>
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {i === crumbs.length - 1 ? (
              <span className="font-medium capitalize text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="capitalize text-muted-foreground transition-colors hover:text-foreground">
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* Search trigger */}
        <button
          onClick={onOpenCommand}
          className="hidden items-center gap-2 rounded-lg border border-border/70 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:flex"
        >
          <Search className="size-4" />
          <span>Search…</span>
          <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <button
          onClick={onOpenCommand}
          className="grid size-9 place-items-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground sm:hidden"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative grid size-9 place-items-center rounded-lg border border-border/70 bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-pink ring-2 ring-background" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-sm font-semibold">Notifications</span>
              <Badge variant="default" className="text-[10px]">2 new</Badge>
            </div>
            <DropdownMenuSeparator />
            {notifications.map((n, i) => (
              <DropdownMenuItem key={i} className="items-start gap-3 py-2.5">
                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted ${n.tone}`}>
                  <n.icon className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                </div>
                {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary">View all</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-0.5 pr-2 transition-colors hover:bg-accent">
              <Avatar className="size-8">
                <AvatarFallback>{initials(displayName)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">{displayName.split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar className="size-10">
                <AvatarFallback>{initials(displayName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile"><User /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings /> Settings</Link>
            </DropdownMenuItem>
            {plan !== "premium" && (
              <DropdownMenuItem asChild>
                <Link href="/pricing"><Crown /> Upgrade to Premium</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
