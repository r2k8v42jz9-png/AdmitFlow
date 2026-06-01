"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { admissionTrend, profileRadar } from "@/lib/data/app";

export function AdmissionTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={admissionTrend} margin={{ top: 6, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-violet))" stopOpacity={0.45} />
            <stop offset="100%" stopColor="hsl(var(--brand-violet))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis domain={[40, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          cursor={{ stroke: "hsl(var(--border))" }}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
            color: "hsl(var(--foreground))",
          }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--brand-violet))"
          strokeWidth={2.5}
          fill="url(#trendGrad)"
          dot={{ r: 3, fill: "hsl(var(--brand-violet))", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export interface RadarDatum {
  axis: string;
  value: number;
}

export function ProfileRadarChart({ data }: { data?: RadarDatum[] }) {
  const series = data ?? profileRadar;
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
