"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * University Constellation — a living, cinematic galaxy of elite universities.
 *
 * Expansive light/editorial network. Nodes float and breathe, particles travel
 * the links, pulses sweep the graph. On hover the focused node becomes dominant
 * and the surrounding network EXPANDS outward (zoom-into-a-star-system), with a
 * large glass info card. Subtle cursor parallax shifts the depth layers.
 *
 * One shared rAF (transform/opacity only) → 60fps. Static under reduced-motion.
 */

interface CNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  mono: string;
  domain: string;
  x: number;
  y: number;
  size: number;
  qs: number;
  accept: string;
  programs: string[];
  scholarships: boolean;
}

const NODES: CNode[] = [
  { id: "mit", name: "MIT", country: "USA", flag: "🇺🇸", mono: "MIT", domain: "mit.edu", x: 0.12, y: 0.3, size: 94, qs: 1, accept: "4%", programs: ["Computer Science", "Artificial Intelligence", "Engineering"], scholarships: true },
  { id: "oxford", name: "Oxford", country: "United Kingdom", flag: "🇬🇧", mono: "OX", domain: "ox.ac.uk", x: 0.34, y: 0.07, size: 84, qs: 3, accept: "17%", programs: ["PPE", "Medicine", "Law"], scholarships: true },
  { id: "cambridge", name: "Cambridge", country: "United Kingdom", flag: "🇬🇧", mono: "CAM", domain: "cam.ac.uk", x: 0.62, y: 0.06, size: 82, qs: 5, accept: "21%", programs: ["Natural Sciences", "Engineering", "Mathematics"], scholarships: true },
  { id: "eth", name: "ETH Zürich", country: "Switzerland", flag: "🇨🇭", mono: "ETH", domain: "ethz.ch", x: 0.88, y: 0.17, size: 76, qs: 7, accept: "27%", programs: ["Computer Science", "Physics", "Engineering"], scholarships: true },
  { id: "stanford", name: "Stanford", country: "USA", flag: "🇺🇸", mono: "STA", domain: "stanford.edu", x: 0.45, y: 0.42, size: 88, qs: 6, accept: "4%", programs: ["Computer Science", "Engineering", "Business"], scholarships: true },
  { id: "harvard", name: "Harvard", country: "USA", flag: "🇺🇸", mono: "HRV", domain: "harvard.edu", x: 0.82, y: 0.45, size: 84, qs: 4, accept: "3%", programs: ["Economics", "Law", "Medicine"], scholarships: true },
  { id: "tum", name: "TU München", country: "Germany", flag: "🇩🇪", mono: "TUM", domain: "tum.de", x: 0.1, y: 0.66, size: 72, qs: 22, accept: "8%", programs: ["Engineering", "Computer Science", "Physics"], scholarships: true },
  { id: "nus", name: "NUS", country: "Singapore", flag: "🇸🇬", mono: "NUS", domain: "nus.edu.sg", x: 0.4, y: 0.9, size: 76, qs: 8, accept: "5%", programs: ["Computing", "Engineering", "Business"], scholarships: true },
  { id: "toronto", name: "Toronto", country: "Canada", flag: "🇨🇦", mono: "TOR", domain: "utoronto.ca", x: 0.67, y: 0.76, size: 76, qs: 21, accept: "43%", programs: ["Computer Science", "Medicine", "Engineering"], scholarships: true },
  { id: "melbourne", name: "Melbourne", country: "Australia", flag: "🇦🇺", mono: "UM", domain: "unimelb.edu.au", x: 0.92, y: 0.72, size: 70, qs: 13, accept: "30%", programs: ["Medicine", "Law", "Arts"], scholarships: true },
];

const NODE_BY_ID: Record<string, CNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES: [string, string][] = [
  ["oxford", "cambridge"], ["oxford", "eth"], ["oxford", "mit"], ["cambridge", "harvard"],
  ["eth", "tum"], ["eth", "melbourne"], ["mit", "stanford"], ["mit", "harvard"],
  ["harvard", "melbourne"], ["stanford", "nus"], ["stanford", "toronto"],
  ["melbourne", "toronto"], ["toronto", "nus"], ["tum", "nus"],
];

const ADJ: Record<string, Set<string>> = {};
for (const n of NODES) ADJ[n.id] = new Set();
for (const [a, b] of EDGES) {
  ADJ[a].add(b);
  ADJ[b].add(a);
}

// extremely subtle free-floating atmosphere particles
const AMBIENT = [
  { x: 0.22, y: 0.2 }, { x: 0.7, y: 0.16 }, { x: 0.5, y: 0.62 }, { x: 0.86, y: 0.55 },
  { x: 0.3, y: 0.78 }, { x: 0.6, y: 0.34 }, { x: 0.16, y: 0.5 }, { x: 0.78, y: 0.86 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const quad = (a: number, c: number, b: number, t: number) => {
  const mt = 1 - t;
  return mt * mt * a + 2 * mt * t * c + t * t * b;
};

export function Constellation() {
  const reduce = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const darkRef = useRef(false);
  useEffect(() => {
    darkRef.current = resolvedTheme === "dark";
  }, [resolvedTheme]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const circleEls = useRef<Record<string, HTMLSpanElement | null>>({});
  const pathEls = useRef<Record<string, SVGPathElement | null>>({});
  const partEls = useRef<Record<string, SVGCircleElement | null>>({});
  const pulseEls = useRef<(SVGCircleElement | null)[]>([]);
  const ambientEls = useRef<(SVGCircleElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string>("mit");
  const hoverRef = useRef<string | null>(null);
  const cardIdRef = useRef<string>("mit");
  const camRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  const enter = (id: string) => {
    setHover(id);
    setCardId(id);
    cardIdRef.current = id;
  };
  const leave = () => setHover(null);

  // Reveal logos already cached at mount (onLoad doesn't fire for those).
  useEffect(() => {
    const imgs = wrapRef.current?.querySelectorAll<HTMLImageElement>("img[data-logo]");
    imgs?.forEach((img) => {
      if (img.complete && img.naturalWidth > 1) {
        img.style.opacity = "1";
        const mono = img.parentElement?.querySelector("[data-mono]") as HTMLElement | null;
        if (mono) mono.style.opacity = "0";
      }
    });
  }, []);

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
    const disp: Record<string, { x: number; y: number }> = {};
    for (const n of NODES) {
      scale[n.id] = 1;
      op[n.id] = 0;
      disp[n.id] = { x: 0, y: 0 };
    }
    const live: Record<string, { x: number; y: number }> = {};
    let cardVis = 0;

    type Pulse = { e: number; t: number; speed: number; on: boolean };
    const pulses: Pulse[] = [0, 1, 2, 3].map(() => ({ e: 0, t: 2, speed: 0.4, on: false }));
    let nextPulse = 1.4;

    let t = 0;
    let last = performance.now();
    let raf = 0;
    const k = reduce ? 1 : 0.2;

    const driftOf = (n: CNode) => {
      if (reduce) return { dx: 0, dy: 0 };
      const seed = n.id.charCodeAt(0) + n.id.length * 13;
      return {
        dx: Math.sin(t * (0.15 + (seed % 5) * 0.013) + seed) * 11,
        dy: Math.cos(t * (0.12 + (seed % 7) * 0.013) + seed * 0.7) * 10,
      };
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) t += dt;

      const hv = hoverRef.current;
      const dk = darkRef.current;
      const neighbors = hv ? ADJ[hv] : null;
      const breathe = reduce ? 1 : 1 + Math.sin(t * 0.5) * 0.006;

      // camera parallax (depth layers react to cursor)
      const cam = camRef.current;
      cam.x = lerp(cam.x, cam.tx, reduce ? 1 : 0.06);
      cam.y = lerp(cam.y, cam.ty, reduce ? 1 : 0.06);
      if (layerRef.current) layerRef.current.style.transform = `translate(${cam.x.toFixed(2)}px,${cam.y.toFixed(2)}px)`;
      if (bgRef.current) bgRef.current.style.transform = `translate(${(cam.x * 0.4).toFixed(2)}px,${(cam.y * 0.4).toFixed(2)}px)`;

      // base (drifted) positions
      const base: Record<string, { x: number; y: number }> = {};
      for (const n of NODES) {
        const d = driftOf(n);
        base[n.id] = { x: n.x * dims.W + d.dx, y: n.y * dims.H + d.dy };
      }

      // EXPAND outward on hover — the network opens up around the focus
      for (const n of NODES) {
        let tx = 0;
        let ty = 0;
        if (hv && hv !== n.id) {
          const f = base[hv];
          const b = base[n.id];
          const dx = b.x - f.x;
          const dy = b.y - f.y;
          const len = Math.hypot(dx, dy) || 1;
          const push = neighbors!.has(n.id) ? 58 : 26;
          tx = (dx / len) * push;
          ty = (dy / len) * push;
        }
        disp[n.id].x = lerp(disp[n.id].x, tx, k);
        disp[n.id].y = lerp(disp[n.id].y, ty, k);
        live[n.id] = { x: base[n.id].x + disp[n.id].x, y: base[n.id].y + disp[n.id].y };
      }

      // nodes — visual hierarchy: focus dominant, neighbours medium, rest recede
      for (const n of NODES) {
        const el = nodeEls.current[n.id];
        const circle = circleEls.current[n.id];
        if (!el || !circle) continue;
        const isHv = hv === n.id;
        const isNear = hv ? neighbors!.has(n.id) : false;
        const targetScale = isHv ? 2.28 : isNear ? 1.22 : hv ? 0.85 : 1;
        const targetOp = !hv ? 1 : isHv || isNear ? 1 : 0.22;
        scale[n.id] = lerp(scale[n.id], targetScale * breathe, k);
        op[n.id] = lerp(op[n.id], targetOp, k);
        const p = live[n.id];
        el.style.transform = `translate(-50%,-50%) translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px)`;
        el.style.opacity = op[n.id].toFixed(3);
        el.style.zIndex = isHv ? "60" : isNear ? "30" : "10";
        const blur = hv && !isHv && !isNear ? (1 - op[n.id]) * 2.2 : 0;
        circle.style.transform = `scale(${scale[n.id].toFixed(3)})`;
        circle.style.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : "none";
      }

      // edges + travelling particles
      EDGES.forEach(([a, b], i) => {
        const pa = live[a];
        const pb = live[b];
        if (!pa || !pb) return;
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = 20;
        const cx = mx + (-dy / len) * bow;
        const cy = my + (dx / len) * bow;
        const path = pathEls.current[`${a}-${b}`];
        if (path) {
          path.setAttribute("d", `M ${pa.x.toFixed(1)} ${pa.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`);
          const active = hv ? a === hv || b === hv : false;
          path.style.strokeOpacity = active
            ? dk ? "0.8" : "0.55"
            : hv ? (dk ? "0.08" : "0.05") : ((dk ? 0.24 : 0.1) + Math.sin(t * 0.6 + i * 0.9) * (dk ? 0.07 : 0.045)).toFixed(3);
          path.style.strokeWidth = active ? (dk ? "2" : "1.8") : dk ? "1.2" : "1";
        }
        const part = partEls.current[`${a}-${b}`];
        if (part && !reduce) {
          const tt = (t * 0.12 + i * 0.21) % 1;
          part.setAttribute("cx", quad(pa.x, cx, pb.x, tt).toFixed(1));
          part.setAttribute("cy", quad(pa.y, cy, pb.y, tt).toFixed(1));
          const active = hv ? a === hv || b === hv : false;
          part.style.opacity = (active ? 0.9 : hv ? 0 : 0.4 * Math.sin(tt * Math.PI)).toFixed(2);
        }
      });

      // network pulses
      if (!reduce) {
        nextPulse -= dt;
        if (nextPulse <= 0) {
          const free = pulses.find((p) => !p.on);
          if (free) {
            free.on = true;
            free.e = Math.floor(Math.random() * EDGES.length);
            free.t = 0;
            free.speed = 0.5 + Math.random() * 0.25;
          }
          nextPulse = 1.6 + Math.random() * 1.8;
        }
        pulses.forEach((p, idx) => {
          const el = pulseEls.current[idx];
          if (!el) return;
          if (!p.on) {
            el.style.opacity = "0";
            return;
          }
          p.t += dt * p.speed;
          if (p.t >= 1) {
            p.on = false;
            el.style.opacity = "0";
            return;
          }
          const [a, b] = EDGES[p.e];
          const pa = live[a];
          const pb = live[b];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const len = Math.hypot(dx, dy) || 1;
          const cx = mx + (-dy / len) * 20;
          const cy = my + (dx / len) * 20;
          el.setAttribute("cx", quad(pa.x, cx, pb.x, p.t).toFixed(1));
          el.setAttribute("cy", quad(pa.y, cy, pb.y, p.t).toFixed(1));
          el.style.opacity = (Math.sin(p.t * Math.PI) * 0.85).toFixed(2);
        });
      }

      // ambient atmosphere particles — extremely subtle, slow
      if (!reduce) {
        AMBIENT.forEach((a, i) => {
          const el = ambientEls.current[i];
          if (!el) return;
          el.setAttribute("cx", ((a.x + Math.sin(t * 0.07 + i) * 0.02) * dims.W).toFixed(1));
          el.setAttribute("cy", ((a.y + Math.cos(t * 0.06 + i * 1.3) * 0.02) * dims.H).toFixed(1));
          el.style.opacity = (0.13 + Math.sin(t * 0.5 + i) * 0.08).toFixed(2);
        });
      }

      // information card — follows the focused node, clears the enlarged node
      const card = cardRef.current;
      if (card) {
        cardVis = lerp(cardVis, hv ? 1 : 0, reduce ? 1 : 0.18);
        if (cardVis > 0.002) {
          const anchor = hv ?? cardIdRef.current;
          const p = live[anchor] ?? { x: dims.W / 2, y: dims.H / 2 };
          const nodeR = ((NODE_BY_ID[anchor]?.size ?? 80) * (scale[anchor] ?? 1)) / 2;
          const cw = card.offsetWidth || 300;
          const ch = card.offsetHeight || 240;
          const flipLeft = p.x + nodeR + cw + 16 > dims.W;
          const cardX = flipLeft ? p.x - nodeR - cw - 14 : p.x + nodeR + 14;
          const cardY = Math.min(Math.max(p.y - ch / 2, 6), Math.max(dims.H - ch - 6, 6));
          const rise = (1 - cardVis) * 12;
          card.style.transform = `translate(${cardX.toFixed(1)}px,${(cardY + rise).toFixed(1)}px) scale(${(0.95 + 0.05 * cardVis).toFixed(3)})`;
          card.style.opacity = cardVis.toFixed(3);
        } else {
          card.style.opacity = "0";
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    camRef.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 26;
    camRef.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 20;
  };
  const onPointerLeave = () => {
    camRef.current.tx = 0;
    camRef.current.ty = 0;
  };

  const cardNode = NODE_BY_ID[cardId];

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative aspect-[1/0.92] w-full"
    >
      {/* atmospheric depth field — a faint glow that hugs the network (no grid/pattern) */}
      <div ref={bgRef} className="pointer-events-none absolute inset-[-12%] -z-10">
        <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.06),transparent_68%)] blur-2xl" />
        <div className="absolute left-[16%] top-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.08),transparent_70%)] blur-3xl" />
        <div className="absolute right-[10%] bottom-[14%] h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-cyan)/0.07),transparent_70%)] blur-3xl" />
      </div>

      {/* parallax layer: links + nodes + card move together */}
      <div ref={layerRef} className="absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible dark:[filter:drop-shadow(0_0_2.5px_hsl(var(--brand-blue)/0.5))]"
          aria-hidden
        >
          {AMBIENT.map((_, i) => (
            <circle
              key={`amb-${i}`}
              ref={(el) => {
                ambientEls.current[i] = el;
              }}
              r={1.4}
              fill="hsl(var(--brand-blue))"
              style={{ opacity: 0 }}
            />
          ))}
          {EDGES.map(([a, b]) => (
            <path
              key={`p-${a}-${b}`}
              ref={(el) => {
                pathEls.current[`${a}-${b}`] = el;
              }}
              fill="none"
              stroke="hsl(var(--brand-blue))"
              strokeLinecap="round"
            />
          ))}
          {EDGES.map(([a, b]) => (
            <circle
              key={`c-${a}-${b}`}
              ref={(el) => {
                partEls.current[`${a}-${b}`] = el;
              }}
              r={2}
              fill="hsl(var(--brand-cyan))"
              style={{ opacity: 0 }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`pulse-${i}`}
              ref={(el) => {
                pulseEls.current[i] = el;
              }}
              r={3.4}
              fill="hsl(var(--brand-blue))"
              style={{ opacity: 0, filter: "drop-shadow(0 0 5px hsl(var(--brand-blue)))" }}
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
              aria-label={`${n.name}, ${n.country}`}
              onMouseEnter={() => enter(n.id)}
              onMouseLeave={leave}
              onFocus={() => enter(n.id)}
              onBlur={leave}
              style={{ opacity: 0 }}
              className="absolute left-0 top-0 flex flex-col items-center outline-none"
            >
              <span
                ref={(el) => {
                  circleEls.current[n.id] = el;
                }}
                style={{ width: n.size, height: n.size }}
                className="relative grid place-items-center will-change-transform"
              >
                <span
                  className={[
                    "absolute rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.46),transparent_68%)] transition-all duration-300 dark:bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.62),transparent_70%)]",
                    active ? "inset-[-42%] opacity-100" : near ? "inset-[-32%] opacity-65" : "inset-[-30%] animate-pulse-glow opacity-40",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute inset-0 rounded-full bg-white ring-1 transition-shadow duration-300",
                    active
                      ? "shadow-[0_30px_70px_-20px_hsl(var(--brand-blue)/0.75)] ring-primary/30"
                      : "shadow-[0_12px_34px_-12px_hsl(224_50%_30%/0.5)] ring-border",
                  ].join(" ")}
                />
                <span className="relative grid size-full place-items-center overflow-hidden rounded-full p-[20%]">
                  <span data-mono className="absolute font-display text-[14px] font-semibold tracking-tight text-primary transition-opacity duration-300">
                    {n.mono}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-logo
                    src={`https://www.google.com/s2/favicons?sz=128&domain=${n.domain}`}
                    alt=""
                    loading="lazy"
                    style={{ opacity: 0 }}
                    onLoad={(e) => {
                      if (e.currentTarget.naturalWidth > 1) {
                        e.currentTarget.style.opacity = "1";
                        const mono = e.currentTarget.parentElement?.querySelector("[data-mono]") as HTMLElement | null;
                        if (mono) mono.style.opacity = "0";
                      }
                    }}
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                    className="relative max-h-full max-w-full object-contain transition-opacity duration-300"
                  />
                </span>
              </span>
              <span
                className={[
                  "pointer-events-none mt-2.5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300",
                  active ? "text-foreground" : "text-muted-foreground/70",
                ].join(" ")}
              >
                {n.name}
              </span>
            </button>
          );
        })}

        {/* Information card */}
        <div
          ref={cardRef}
          style={{ opacity: 0, transform: "translate(0,0)" }}
          className="pointer-events-none absolute left-0 top-0 z-[70] w-[336px] rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_50px_110px_-40px_hsl(224_60%_30%/0.55),0_8px_24px_-12px_hsl(224_40%_30%/0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-card/85 dark:shadow-[0_50px_120px_-40px_hsl(224_80%_2%/0.9),0_0_0_1px_hsl(var(--brand-blue)/0.12)]"
        >
          {cardNode && (
            <>
              <div className="flex items-center gap-3.5">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2.5 ring-1 ring-black/[0.06] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://www.google.com/s2/favicons?sz=128&domain=${cardNode.domain}`} alt="" className="max-h-full max-w-full object-contain" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold leading-tight">{cardNode.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span aria-hidden>{cardNode.flag}</span> {cardNode.country}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-muted/60 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">QS Ranking</p>
                  <p className="mt-0.5 font-display text-xl font-semibold tabular-nums">#{cardNode.qs}</p>
                </div>
                <div className="rounded-xl bg-muted/60 px-3 py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Acceptance</p>
                  <p className="mt-0.5 font-display text-xl font-semibold tabular-nums">{cardNode.accept}</p>
                </div>
              </div>

              <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Top programs</p>
              <ul className="mt-2 space-y-1.5">
                {cardNode.programs.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[14px] text-foreground/85">
                    <span className="size-1.5 rounded-full bg-primary" /> {p}
                  </li>
                ))}
              </ul>

              {cardNode.scholarships && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1.5 text-[12px] font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" /> Scholarships available
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
