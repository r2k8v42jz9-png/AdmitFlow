"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * University Constellation — Phase 1: the living network stage.
 *
 * A light, editorial knowledge network. University nodes drift organically
 * (5–10px), curved connections re-path to follow them, and the field gently
 * breathes. On hover/focus, the node springs forward (1.6×), its neighbours
 * illuminate and the rest recede. One shared rAF drives everything (transform /
 * opacity only) for 60fps; fully static under prefers-reduced-motion.
 *
 * (Real data cards, insight tags and "My Chances" mode come in later phases.)
 */

interface CNode {
  id: string;
  name: string;
  mono: string; // initials placeholder until a real logo is wired
  x: number; // 0..1 base position
  y: number;
  size: number; // tile diameter in px (rank weight)
}

const NODES: CNode[] = [
  { id: "oxford", name: "Oxford", mono: "OX", x: 0.3, y: 0.12, size: 64 },
  { id: "cambridge", name: "Cambridge", mono: "CAM", x: 0.58, y: 0.1, size: 60 },
  { id: "eth", name: "ETH Zürich", mono: "ETH", x: 0.83, y: 0.2, size: 58 },
  { id: "mit", name: "MIT", mono: "MIT", x: 0.16, y: 0.36, size: 68 },
  { id: "harvard", name: "Harvard", mono: "HAR", x: 0.74, y: 0.42, size: 64 },
  { id: "stanford", name: "Stanford", mono: "STA", x: 0.43, y: 0.5, size: 66 },
  { id: "melbourne", name: "Melbourne", mono: "MEL", x: 0.88, y: 0.6, size: 54 },
  { id: "toronto", name: "Toronto", mono: "TOR", x: 0.65, y: 0.7, size: 58 },
  { id: "tum", name: "TU München", mono: "TUM", x: 0.14, y: 0.64, size: 54 },
  { id: "nus", name: "NUS", mono: "NUS", x: 0.44, y: 0.85, size: 56 },
];

const EDGES: [string, string][] = [
  ["oxford", "cambridge"],
  ["oxford", "eth"],
  ["oxford", "mit"],
  ["cambridge", "harvard"],
  ["eth", "tum"],
  ["eth", "melbourne"],
  ["mit", "stanford"],
  ["mit", "harvard"],
  ["harvard", "melbourne"],
  ["stanford", "nus"],
  ["stanford", "toronto"],
  ["melbourne", "toronto"],
  ["toronto", "nus"],
  ["tum", "nus"],
];

// adjacency for illumination
const ADJ: Record<string, Set<string>> = {};
for (const n of NODES) ADJ[n.id] = new Set();
for (const [a, b] of EDGES) {
  ADJ[a].add(b);
  ADJ[b].add(a);
}

export function Constellation() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const circleEls = useRef<Record<string, HTMLSpanElement | null>>({});
  const pathEls = useRef<Record<string, SVGPathElement | null>>({});
  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);
  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const dims = { W: 0, H: 0 };
    const measure = () => {
      const r = wrap.getBoundingClientRect();
      dims.W = r.width;
      dims.H = r.height;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    const scale: Record<string, number> = {};
    const op: Record<string, number> = {};
    for (const n of NODES) {
      scale[n.id] = 1;
      op[n.id] = 0; // fade in
    }

    let t = 0;
    let last = performance.now();
    let raf = 0;

    const drift = (n: CNode) => {
      if (reduce) return { dx: 0, dy: 0 };
      const seed = n.id.charCodeAt(0) + n.id.length * 13;
      return {
        dx: Math.sin(t * (0.16 + (seed % 5) * 0.015) + seed) * 9,
        dy: Math.cos(t * (0.13 + (seed % 7) * 0.015) + seed * 0.7) * 8,
      };
    };

    const live: Record<string, { x: number; y: number }> = {};

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) t += dt;

      const breathe = reduce ? 1 : 1 + Math.sin(t * 0.5) * 0.006;
      for (const n of NODES) {
        const d = drift(n);
        live[n.id] = { x: n.x * dims.W + d.dx, y: n.y * dims.H + d.dy };
      }

      const hv = hoverRef.current;
      const neighbors = hv ? ADJ[hv] : null;

      for (const n of NODES) {
        const el = nodeEls.current[n.id];
        const circle = circleEls.current[n.id];
        if (!el || !circle) continue;
        const isHv = hv === n.id;
        const isNear = hv ? neighbors!.has(n.id) : false;
        const targetScale = isHv ? 1.6 : isNear ? 1.1 : 1;
        const targetOp = !hv ? 1 : isHv || isNear ? 1 : 0.3;
        scale[n.id] += (targetScale * breathe - scale[n.id]) * (reduce ? 1 : 0.22);
        op[n.id] += (targetOp - op[n.id]) * (reduce ? 1 : 0.22);
        const p = live[n.id];
        el.style.transform = `translate(-50%,-50%) translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px)`;
        el.style.opacity = op[n.id].toFixed(3);
        el.style.zIndex = isHv ? "40" : "10";
        circle.style.transform = `scale(${scale[n.id].toFixed(3)})`;
      }

      for (const [a, b] of EDGES) {
        const path = pathEls.current[`${a}-${b}`];
        if (!path) continue;
        const pa = live[a];
        const pb = live[b];
        if (!pa || !pb) continue;
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = 16;
        const cx = mx + (-dy / len) * bow;
        const cy = my + (dx / len) * bow;
        path.setAttribute("d", `M ${pa.x.toFixed(1)} ${pa.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`);
        const active = hv ? (a === hv || b === hv) : false;
        path.style.strokeOpacity = active ? "0.5" : hv ? "0.06" : "0.15";
        path.style.strokeWidth = active ? "1.6" : "1";
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  return (
    <div ref={wrapRef} className="relative aspect-[4/3] w-full">
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {EDGES.map(([a, b]) => (
          <path
            key={`${a}-${b}`}
            ref={(el) => {
              pathEls.current[`${a}-${b}`] = el;
            }}
            fill="none"
            stroke="hsl(var(--brand-blue))"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {NODES.map((n) => {
        const active = hover === n.id;
        const near = hover ? ADJ[hover].has(n.id) : false;
        return (
          <button
            key={n.id}
            ref={(el) => {
              nodeEls.current[n.id] = el;
            }}
            type="button"
            aria-label={n.name}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
            style={{ opacity: 0 }}
            className="absolute left-0 top-0 flex flex-col items-center outline-none"
          >
            <span
              ref={(el) => {
                circleEls.current[n.id] = el;
              }}
              style={{ width: n.size, height: n.size }}
              className={[
                "grid place-items-center rounded-full border bg-card/90 backdrop-blur transition-[box-shadow,border-color] duration-300",
                active
                  ? "border-primary/45 shadow-[0_0_0_5px_hsl(var(--brand-blue)/0.1),0_18px_45px_-12px_hsl(var(--brand-blue)/0.6)]"
                  : near
                    ? "border-primary/30 shadow-[0_0_0_3px_hsl(var(--brand-blue)/0.08)]"
                    : "border-border shadow-[0_8px_24px_-12px_hsl(224_50%_30%/0.35)]",
              ].join(" ")}
            >
              <span className="font-display text-[13px] font-semibold tracking-tight text-primary">{n.mono}</span>
            </span>
            <span
              className={[
                "pointer-events-none mt-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] transition-colors duration-300",
                active ? "text-foreground" : "text-muted-foreground/70",
              ].join(" ")}
            >
              {n.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
