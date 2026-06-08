"use client";

import { useEffect, useRef } from "react";

/**
 * "Admission pathways" — the hero's signature visual. Universities sit around a
 * central applicant node; luminous particles flow along curved pathways from the
 * student out to each university. Canvas 2D for buttery 60fps; crisp HTML chips
 * (in the parent) sit on top so the names stay sharp and accessible.
 *
 * Light-theme native: ink-blue pathways on an airy field. Honors reduced motion
 * (draws the static network, no travelling particles).
 */

export interface PathNode {
  x: number; // 0..1 within the panel
  y: number;
}

export function PathwaysCanvas({
  nodes,
  center = { x: 0.5, y: 0.52 },
  reduced = false,
}: {
  nodes: PathNode[];
  center?: PathNode;
  reduced?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const quad = (a: number, c: number, b: number, t: number) => {
      const mt = 1 - t;
      return mt * mt * a + 2 * mt * t * c + t * t * b;
    };

    let raf = 0;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = center.x * w;
      const cy = center.y * h;

      nodes.forEach((n, i) => {
        const nx = n.x * w;
        const ny = n.y * h;
        // gentle arc: perpendicular offset on the midpoint, alternating side
        const mx = (cx + nx) / 2;
        const my = (cy + ny) / 2;
        const dx = nx - cx;
        const dy = ny - cy;
        const len = Math.hypot(dx, dy) || 1;
        const side = i % 2 === 0 ? 1 : -1;
        const cpx = mx + (-dy / len) * len * 0.18 * side;
        const cpy = my + (dx / len) * len * 0.18 * side;

        // base pathway
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cpx, cpy, nx, ny);
        ctx.strokeStyle = "rgba(37, 71, 158, 0.16)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // travelling light
        if (!reduced) {
          for (let k = 0; k < 2; k++) {
            const tt = (t * 0.14 + i * 0.19 + k * 0.5) % 1;
            const px = quad(cx, cpx, nx, tt);
            const py = quad(cy, cpy, ny, tt);
            const a = Math.sin(tt * Math.PI); // fade in/out across the path
            ctx.beginPath();
            ctx.arc(px, py, 2.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37, 99, 235, ${0.85 * a})`;
            ctx.shadowColor = "rgba(37, 99, 235, 0.85)";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // node anchor
        ctx.beginPath();
        ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.55)";
        ctx.fill();
      });

      // central applicant node
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37, 99, 235, 1)";
      ctx.shadowColor = "rgba(37, 99, 235, 0.7)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(37, 99, 235, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reduced) {
        t += 0.016;
        raf = requestAnimationFrame(render);
      }
    };

    render();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [nodes, center, reduced]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
