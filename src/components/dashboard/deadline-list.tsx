import { CalendarClock, FileText, GraduationCap, Award } from "lucide-react";
import { deadlines } from "@/lib/data/app";
import { getUniversity } from "@/lib/data/universities";
import { formatDate, relativeDeadline, daysUntil, cn } from "@/lib/utils";
import type { DeadlineItem } from "@/lib/types";

const typeMeta: Record<DeadlineItem["type"], { icon: typeof CalendarClock; tone: string }> = {
  application: { icon: CalendarClock, tone: "bg-brand-blue/15 text-brand-blue" },
  scholarship: { icon: Award, tone: "bg-brand-violet/15 text-brand-violet" },
  exam: { icon: GraduationCap, tone: "bg-warning/15 text-warning" },
  document: { icon: FileText, tone: "bg-brand-cyan/15 text-brand-cyan" },
};

export function DeadlineList({ limit }: { limit?: number }) {
  const items = [...deadlines]
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
    .filter((d) => daysUntil(d.date) >= 0);
  const shown = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-1">
      {shown.map((d) => {
        const meta = typeMeta[d.type];
        const Icon = meta.icon;
        const dl = relativeDeadline(d.date);
        const uni = d.universityId ? getUniversity(d.universityId) : undefined;
        return (
          <div key={d.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/50">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", meta.tone)}>
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(d.date)}
                {uni && ` · ${uni.shortName}`}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                dl.tone === "danger"
                  ? "bg-destructive/15 text-destructive"
                  : dl.tone === "warning"
                    ? "bg-warning/15 text-warning"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {dl.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
