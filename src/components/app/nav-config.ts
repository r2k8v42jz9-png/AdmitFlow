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
  /** i18n key (falls back to `label`). */
  key: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const mainNav: NavItem[] = [
  { label: "Dashboard", key: "app.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Mentor", key: "app.mentor", href: "/mentor", icon: Sparkles, badge: "AI" },
  { label: "Universities", key: "app.universities", href: "/universities", icon: Building2 },
  { label: "Roadmap", key: "app.roadmap", href: "/roadmap", icon: Map },
];

export const secondaryNav: NavItem[] = [
  { label: "Profile", key: "app.profile", href: "/profile", icon: User },
  { label: "Settings", key: "app.settings", href: "/settings", icon: Settings },
];

export const allNav = [...mainNav, ...secondaryNav];
