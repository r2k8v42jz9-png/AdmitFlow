"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { GLOBE_POINTS, GLOBE_ROUTES, type GlobePoint } from "@/lib/globe-data";

const R = 1; // globe radius

/* lat/lng (degrees) → point on a sphere of radius `r`. */
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/* ---------- Atmosphere (fresnel rim glow, drawn on the back side) ---------- */
const atmVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const atmFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  void main() {
    vec3 viewDir = normalize(-vView);
    float f = pow(1.0 - abs(dot(vNormal, viewDir)), uPower);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#4f86ff") },
      uPower: { value: 3.2 },
      uIntensity: { value: 1.15 },
    }),
    [],
  );
  return (
    <mesh scale={1.22}>
      <sphereGeometry args={[R, 64, 64]} />
      <shaderMaterial
        vertexShader={atmVertex}
        fragmentShader={atmFragment}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------- Graticule (lat/long wireframe) ---------- */
function Graticule() {
  const lines = useMemo(() => {
    const segs: THREE.Vector3[][] = [];
    // latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 6) pts.push(latLngToVec3(lat, lng, R * 1.001));
      segs.push(pts);
    }
    // longitude rings
    for (let lng = -180; lng < 180; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 6) pts.push(latLngToVec3(lat, lng, R * 1.001));
      segs.push(pts);
    }
    return segs;
  }, []);

  return (
    <group>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#3b6ed6" transparent opacity={0.16} lineWidth={1} />
      ))}
    </group>
  );
}

/* ---------- University markers (glowing dot + pulsing halo) ---------- */
function Marker({ point }: { point: GlobePoint }) {
  const pos = useMemo(() => latLngToVec3(point.lat, point.lng, R * 1.005), [point]);
  const haloRef = useRef<THREE.Mesh>(null);
  const w = point.weight ?? 0.7;
  const color = point.hub ? "#ffd27a" : "#7cc0ff";

  useFrame(({ clock }) => {
    if (!haloRef.current) return;
    const t = clock.getElapsedTime() + point.lat; // phase offset per marker
    const s = 1 + Math.sin(t * 2) * 0.35;
    haloRef.current.scale.setScalar(s);
    const mat = haloRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + Math.sin(t * 2) * 0.2;
  });

  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.012 + w * 0.012, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh ref={haloRef}>
          <circleGeometry args={[0.03 + w * 0.03, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

/* ---------- Admission-route arc + a light that travels it ---------- */
function RouteArc({ from, to, delay }: { from: THREE.Vector3; to: THREE.Vector3; delay: number }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const { curve, points } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dist = from.distanceTo(to);
    mid.normalize().multiplyScalar(R + 0.18 + dist * 0.32); // lift arc off the surface
    const c = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
    return { curve: c, points: c.getPoints(60) };
  }, [from, to]);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const t = (clock.getElapsedTime() * 0.25 + delay) % 1;
    const p = curve.getPointAt(t);
    dotRef.current.position.copy(p);
    const mat = dotRef.current.material as THREE.MeshBasicMaterial;
    // fade in/out at the ends so it reads as a journey, not a loop
    mat.opacity = Math.sin(t * Math.PI);
  });

  return (
    <group>
      <Line points={points} color="#5b8cff" transparent opacity={0.45} lineWidth={1.3} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshBasicMaterial color="#bcd8ff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- The rotating globe group ---------- */
export function GlobeScene() {
  const group = useRef<THREE.Group>(null);
  const pointer = useThree((s) => s.pointer);

  const byId = useMemo(() => {
    const m = new Map<string, GlobePoint>();
    for (const p of GLOBE_POINTS) m.set(p.id, p);
    return m;
  }, []);

  const routes = useMemo(
    () =>
      GLOBE_ROUTES.map(([a, b], i) => {
        const pa = byId.get(a);
        const pb = byId.get(b);
        if (!pa || !pb) return null;
        return {
          key: `${a}-${b}`,
          from: latLngToVec3(pa.lat, pa.lng, R * 1.005),
          to: latLngToVec3(pb.lat, pb.lng, R * 1.005),
          delay: i / GLOBE_ROUTES.length,
        };
      }).filter(Boolean) as { key: string; from: THREE.Vector3; to: THREE.Vector3; delay: number }[],
    [byId],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06; // gentle auto-rotation
    // subtle mouse parallax tilt
    const targetX = -pointer.y * 0.25;
    const targetZ = pointer.x * 0.12;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 4]} intensity={1.4} color="#dce8ff" />
      <pointLight position={[-4, -1, -3]} intensity={1.2} color="#2d57c8" />

      <group ref={group} rotation={[0.35, 0, 0]}>
        {/* solid globe body */}
        <mesh>
          <sphereGeometry args={[R, 96, 96]} />
          <meshStandardMaterial
            color="#0a1430"
            emissive="#0b1f4d"
            emissiveIntensity={0.35}
            metalness={0.2}
            roughness={0.85}
          />
        </mesh>
        <Graticule />
        {GLOBE_POINTS.map((p) => (
          <Marker key={p.id} point={p} />
        ))}
        {routes.map((r) => (
          <RouteArc key={r.key} from={r.from} to={r.to} delay={r.delay} />
        ))}
      </group>

      <Atmosphere />
    </>
  );
}
