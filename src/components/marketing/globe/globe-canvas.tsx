"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { GlobeScene } from "./globe-scene";

/**
 * The actual WebGL canvas. Imported dynamically (ssr:false) so three.js never
 * ships to the server bundle and only loads when the hero is on screen.
 */
export default function GlobeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.25], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Stars radius={6} depth={10} count={1400} factor={0.22} saturation={0} fade speed={0.6} />
        <GlobeScene />
      </Suspense>
    </Canvas>
  );
}
