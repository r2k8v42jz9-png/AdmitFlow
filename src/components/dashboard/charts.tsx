"use client";

import {
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export interface RadarDatum {
  axis: string;
  value: number;
}

/** Profile-strength radar. Data is always derived from the user's real profile. */
export function ProfileRadarChart({ data }: { data: RadarDatum[] }) {
  const series = data;
  return (
    // Generous height + margin so the outer angle-axis labels never clip.
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={series} outerRadius="62%" margin={{ top: 24, right: 36, bottom: 24, left: 36 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="hsl(var(--brand-blue))"
          strokeWidth={2}
          fill="hsl(var(--brand-blue))"
          fillOpacity={0.25}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
