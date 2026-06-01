import {
  Sparkles,
  Target,
  Map,
  Building2,
  FileText,
  CalendarClock,
  GraduationCap,
  Telescope,
  PenLine,
  Send,
  PartyPopper,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Sparkles,
  Target,
  Map,
  Building2,
  FileText,
  CalendarClock,
  GraduationCap,
  Telescope,
  PenLine,
  Send,
  PartyPopper,
  MessageSquare,
};

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = registry[name] ?? GraduationCap;
  return <Icon className={className} />;
}
