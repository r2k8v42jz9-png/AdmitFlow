import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Map,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Mentor", href: "/mentor", icon: Sparkles, badge: "AI" },
  { label: "Universities", href: "/universities", icon: Building2 },
  { label: "Roadmap", href: "/roadmap", icon: Map },
];

export const secondaryNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const allNav = [...mainNav, ...secondaryNav];
