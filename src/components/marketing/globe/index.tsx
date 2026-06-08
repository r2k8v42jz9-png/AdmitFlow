"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// Lazy, client-only — three.js loads only when the hero mounts in the browser.
const GlobeCanvas = dynamic(() => import("./globe-canvas"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

/** Static, dependency-free stand-in: an atmospheric orb (reduced-motion + load). */
function GlobeFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="relative h-[78%] aspect-square">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,hsl(var(--brand-blue)/0.55),hsl(220_60%_8%)_60%,transparent_72%)]" />
        <div className="absolute inset-0 rounded-full bg-grid opacity-30 [mask-image:radial-gradient(circle,#000_55%,transparent_72%)]" />
        <div className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,transparent_58%,hsl(var(--brand-blue)/0.25)_66%,transparent_75%)] blur-md" />
      </div>
    </div>
  );
}

export function Globe() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0">
      {reduce ? <GlobeFallback /> : <GlobeCanvas />}
    </div>
  );
}
