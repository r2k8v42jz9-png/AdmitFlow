"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * University Constellation — the signature visual identity.
 *
 * A living, light/editorial network of elite universities. Nodes float and
 * breathe, particles travel the links, and pulses sweep the network. On hover a
 * node lifts to centre stage, its neighbours orbit in, unrelated nodes recede
 * and blur, and a glass information card springs in with real data.
 *
 * One shared rAF drives positions / scales / particles / pulses / card (all
 * transform + opacity) for 60fps. Fully static under prefers-reduced-motion.
 */

interface CNode {
  id: string;
  name: string;
  country: string;
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
  { id: "mit", name: "MIT", country: "USA", mono: "MIT", domain: "mit.edu", x: 0.17, y: 0.34, size: 70, qs: 1, accept: "4%", programs: ["Computer Science", "Artificial Intelligence", "Engineering"], scholarships: true },
  { id: "oxford", name: "Oxford", country: "United Kingdom", mono: "OX", domain: "ox.ac.uk", x: 0.31, y: 0.12, size: 64, qs: 3, accept: "17%", programs: ["PPE", "Medicine", "Law"], scholarships: true },
  { id: "harvard", name: "Harvard", country: "USA", mono: "HRV", domain: "harvard.edu", x: 0.74, y: 0.4, size: 66, qs: 4, accept: "3%", programs: ["Economics", "Law", "Medicine"], scholarships: true },
  { id: "cambridge", name: "Cambridge", country: "United Kingdom", mono: "CAM", domain: "cam.ac.uk", x: 0.58, y: 0.1, size: 62, qs: 5, accept: "21%", programs: ["Natural Sciences", "Engineering", "Mathematics"], scholarships: true },
  { id: "stanford", name: "Stanford", country: "USA", mono: "STA", domain: "stanford.edu", x: 0.44, y: 0.5, size: 66, qs: 6, accept: "4%", programs: ["Computer Science", "Engineering", "Business"], scholarships: true },
  { id: "eth", name: "ETH Zürich", country: "Switzerland", mono: "ETH", domain: "ethz.ch", x: 0.83, y: 0.19, size: 58, qs: 7, accept: "27%", programs: ["Computer Science", "Physics", "Engineering"], scholarships: true },
  { id: "nus", name: "NUS", country: "Singapore", mono: "NUS", domain: "nus.edu.sg", x: 0.45, y: 0.85, size: 58, qs: 8, accept: "5%", programs: ["Computing", "Engineering", "Business"], scholarships: true },
  { id: "toronto", name: "Toronto", country: "Canada", mono: "TOR", domain: "utoronto.ca", x: 0.66, y: 0.69, size: 58, qs: 21, accept: "43%", programs: ["Computer Science", "Medicine", "Engineering"], scholarships: true },
  { id: "melbourne", name: "Melbourne", country: "Australia", mono: "UM", domain: "unimelb.edu.au", x: 0.88, y: 0.61, size: 54, qs: 13, accept: "30%", programs: ["Medicine", "Law", "Arts"], scholarships: true },
  { id: "tum", name: "TU München", country: "Germany", mono: "TUM", domain: "tum.de", x: 0.14, y: 0.64, size: 54, qs: 22, accept: "8%", programs: ["Engineering", "Computer Science", "Physics"], scholarships: true },
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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const quad = (a: number, c: number, b: number, t: number) => {
  const mt = 1 - t;
  return mt * mt * a + 2 * mt * t * c + t * t * b;
};

export function Constellation() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const circleEls = useRef<Record<string, HTMLSpanElement | null>>({});
  const pathEls = useRef<Record<string, SVGPathElement | null>>({});
  const partEls = useRef<Record<string, SVGCircleElement | null>>({});
  const pulseEls = useRef<(SVGCircleElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string>("mit");
  const hoverRef = useRef<string | null>(null);
  const cardIdRef = useRef<string>("mit");
  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  const enter = (id: string) => {
    setHover(id);
    setCardId(id);
    cardIdRef.current = id;
  };
  const leave = () => setHover(null);

  // Reveal logos that were already cached at mount (onLoad doesn't fire for those).
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
    const k = reduce ? 1 : 0.22;

    const driftOf = (n: CNode) => {
      if (reduce) return { dx: 0, dy: 0 };
      const seed = n.id.charCodeAt(0) + n.id.length * 13;
      return {
        dx: Math.sin(t * (0.16 + (seed % 5) * 0.015) + seed) * 9,
        dy: Math.cos(t * (0.13 + (seed % 7) * 0.015) + seed * 0.7) * 8,
      };
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) t += dt;

      const hv = hoverRef.current;
      const neighbors = hv ? ADJ[hv] : null;
      const breathe = reduce ? 1 : 1 + Math.sin(t * 0.5) * 0.006;

      // base (drifted) positions
      const base: Record<string, { x: number; y: number }> = {};
      for (const n of NODES) {
        const d = driftOf(n);
        base[n.id] = { x: n.x * dims.W + d.dx, y: n.y * dims.H + d.dy };
      }

      // orbital reposition of neighbours toward the focused node
      for (const n of NODES) {
        let tx = 0;
        let ty = 0;
        if (hv && hv !== n.id && neighbors!.has(n.id)) {
          const f = base[hv];
          const b = base[n.id];
          const dx = b.x - f.x;
          const dy = b.y - f.y;
          const len = Math.hypot(dx, dy) || 1;
          const orbit = Math.min(Math.max(dims.W, dims.H) * 0.2, 150);
          tx = (f.x + (dx / len) * orbit) - b.x;
          ty = (f.y + (dy / len) * orbit) - b.y;
        }
        disp[n.id].x = lerp(disp[n.id].x, tx, k);
        disp[n.id].y = lerp(disp[n.id].y, ty, k);
        live[n.id] = { x: base[n.id].x + disp[n.id].x, y: base[n.id].y + disp[n.id].y };
      }

      // nodes
      for (const n of NODES) {
        const el = nodeEls.current[n.id];
        const circle = circleEls.current[n.id];
        if (!el || !circle) continue;
        const isHv = hv === n.id;
        const isNear = hv ? neighbors!.has(n.id) : false;
        const targetScale = isHv ? 1.62 : isNear ? 1.12 : 1;
        const targetOp = !hv ? 1 : isHv || isNear ? 1 : 0.28;
        scale[n.id] = lerp(scale[n.id], targetScale * breathe, k);
        op[n.id] = lerp(op[n.id], targetOp, k);
        const p = live[n.id];
        el.style.transform = `translate(-50%,-50%) translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px)`;
        el.style.opacity = op[n.id].toFixed(3);
        el.style.zIndex = isHv ? "40" : isNear ? "20" : "10";
        const blur = hv && !isHv && !isNear ? (1 - op[n.id]) * 1.6 : 0;
        circle.style.transform = `scale(${scale[n.id].toFixed(3)})`;
        circle.style.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : "none";
      }

      // edges + their travelling particles
      EDGES.forEach(([a, b], i) => {
        const pa = live[a];
        const pb = live[b];
        if (!pa || !pb) return;
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const len = Math.hypot(dx, dy) || 1;
        const bow = 16;
        const cx = mx + (-dy / len) * bow;
        const cy = my + (dx / len) * bow;
        const path = pathEls.current[`${a}-${b}`];
        if (path) {
          path.setAttribute("d", `M ${pa.x.toFixed(1)} ${pa.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`);
          const active = hv ? a === hv || b === hv : false;
          path.style.strokeOpacity = active ? "0.55" : hv ? "0.05" : "0.14";
          path.style.strokeWidth = active ? "1.7" : "1";
        }
        // ambient particle
        const part = partEls.current[`${a}-${b}`];
        if (part && !reduce) {
          const tt = (t * 0.13 + i * 0.21) % 1;
          part.setAttribute("cx", quad(pa.x, cx, pb.x, tt).toFixed(1));
          part.setAttribute("cy", quad(pa.y, cy, pb.y, tt).toFixed(1));
          const active = hv ? a === hv || b === hv : false;
          part.style.opacity = (active ? 0.9 : hv ? 0.0 : 0.4 * Math.sin(tt * Math.PI)).toFixed(2);
        }
      });

      // network pulses (occasional bright sweep through a link)
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
          const cx = mx + (-dy / len) * 16;
          const cy = my + (dx / len) * 16;
          el.setAttribute("cx", quad(pa.x, cx, pb.x, p.t).toFixed(1));
          el.setAttribute("cy", quad(pa.y, cy, pb.y, p.t).toFixed(1));
          el.style.opacity = (Math.sin(p.t * Math.PI) * 0.85).toFixed(2);
        });
      }

      // information card — follows the focused node, springs in
      const card = cardRef.current;
      if (card) {
        const visTarget = hv ? 1 : 0;
        cardVis = lerp(cardVis, visTarget, reduce ? 1 : 0.2);
        if (cardVis > 0.002) {
          const anchor = hv ?? cardIdRef.current;
          const p = live[anchor] ?? { x: dims.W / 2, y: dims.H / 2 };
          const cw = card.offsetWidth || 240;
          const flipLeft = p.x > dims.W - cw - 30;
          const cardX = flipLeft ? p.x - cw - 26 : p.x + 26;
          const cardY = Math.min(Math.max(p.y - 40, 6), dims.H - (card.offsetHeight || 200) - 6);
          const rise = (1 - cardVis) * 10;
          card.style.transform = `translate(${cardX.toFixed(1)}px,${(cardY + rise).toFixed(1)}px) scale(${(0.96 + 0.04 * cardVis).toFixed(3)})`;
          card.style.opacity = cardVis.toFixed(3);
          card.style.pointerEvents = "none";
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

  const cardNode = NODE_BY_ID[cardId];

  return (
    <div ref={wrapRef} className="relative aspect-[4/3] w-full">
      {/* atmospheric depth field */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
        <div className="absolute left-[20%] top-[22%] h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.1),transparent_70%)] blur-2xl" />
        <div className="absolute right-[14%] bottom-[18%] h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--brand-cyan)/0.1),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-dots opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      </div>

      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
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
            r={1.7}
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
            r={3}
            fill="hsl(var(--brand-blue))"
            style={{ opacity: 0, filter: "drop-shadow(0 0 4px hsl(var(--brand-blue)))" }}
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
              {/* layered glow rings */}
              <span
                className={[
                  "absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,hsl(var(--brand-blue)/0.35),transparent_68%)] transition-opacity duration-300",
                  active ? "opacity-100" : near ? "opacity-60" : "animate-pulse-glow opacity-40",
                ].join(" ")}
              />
              <span className="absolute inset-0 rounded-full bg-white shadow-[0_10px_30px_-10px_hsl(224_50%_30%/0.45)] ring-1 ring-border" />
              {/* logo / monogram */}
              <span className="relative grid size-full place-items-center overflow-hidden rounded-full p-[20%]">
                <span data-mono className="absolute font-display text-[13px] font-semibold tracking-tight text-primary transition-opacity duration-300">
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
                "pointer-events-none mt-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] transition-colors duration-300",
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
        className="glass-strong pointer-events-none absolute left-0 top-0 z-50 w-[238px] rounded-2xl p-4 shadow-[0_30px_70px_-30px_hsl(224_60%_30%/0.5)]"
      >
        {cardNode && (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold leading-tight">{cardNode.name}</p>
                <p className="text-xs text-muted-foreground">{cardNode.country}</p>
              </div>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">QS #{cardNode.qs}</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/60 px-2.5 py-2">
              <span className="text-[11px] text-muted-foreground">Acceptance rate</span>
              <span className="font-display text-sm font-semibold tabular-nums">{cardNode.accept}</span>
            </div>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Top programs</p>
            <ul className="mt-1.5 space-y-1">
              {cardNode.programs.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] text-foreground/85">
                  <span className="size-1 rounded-full bg-primary" /> {p}
                </li>
              ))}
            </ul>
            {cardNode.scholarships && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" /> Scholarships available
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
