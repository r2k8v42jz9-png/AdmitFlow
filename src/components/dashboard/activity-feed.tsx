import { Sparkles, FileText, CalendarClock, Building2, Flag } from "lucide-react";
import { activity } from "@/lib/data/app";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/types";

const meta: Record<ActivityItem["type"], { icon: typeof Sparkles; tone: string }> = {
  ai: { icon: Sparkles, tone: "bg-primary/15 text-primary" },
  document: { icon: FileText, tone: "bg-brand-cyan/15 text-brand-cyan" },
  deadline: { icon: CalendarClock, tone: "bg-warning/15 text-warning" },
  university: { icon: Building2, tone: "bg-brand-violet/15 text-brand-violet" },
  milestone: { icon: Flag, tone: "bg-success/15 text-success" },
};

export function ActivityFeed() {
  return (
    <ol className="relative space-y-1">
      {activity.map((a, i) => {
        const m = meta[a.type];
        const Icon = m.icon;
        const last = i === activity.length - 1;
        return (
          <li key={a.id} className="relative flex gap-3.5 pb-1">
            {!last && <span className="absolute left-[18px] top-9 h-[calc(100%-1rem)] w-px bg-border/70" />}
            <span className={cn("z-10 grid size-9 shrink-0 place-items-center rounded-full ring-4 ring-background", m.tone)}>
              <Icon className="size-4" />
            </span>
            <div className="flex-1 pt-0.5">
              <p className="text-sm leading-snug text-foreground/90">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.detail}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">{a.time}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
