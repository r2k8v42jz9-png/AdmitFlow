"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
import { getPricingTiers } from "@/lib/data/marketing";
import { getUserState, setSubscription, type Plan } from "@/lib/user-store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ── AdmitFlow brand palette (replaces the original cyan) ───────────────────── */
const BRAND = "#4F7CFF"; // primary
const BRAND_2 = "#7AA2FF"; // secondary
const GLOW = "rgba(79,124,255,0.35)"; // accent glow

/** Contact address for the Elite (expert support) plan. */
const CONTACT_HREF = "mailto:admissions@admitflow.app?subject=AdmitFlow%20Elite%20Plan";

/* ── Check icon ─────────────────────────────────────────────────────────────── */
const CheckIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ── Animated WebGL shader background (the ring is part of the branding) ─────── */
/* Scoped to the pricing section (absolute inset-0) rather than a fixed full page. */
const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState([1.0, 1.0, 1.0]);

  // Follow the app's light/dark theme (next-themes toggles the `dark` class).
  useEffect(() => {
    const root = document.documentElement;
    const updateColor = () => {
      const isDark = root.classList.contains("dark");
      setBackgroundColor(isDark ? [0.04, 0.05, 0.09] : [1.0, 1.0, 1.0]);
    };
    updateColor();
    const observer = new MutationObserver(() => updateColor());
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    // Ring tinted toward the AdmitFlow blue/indigo palette.
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        uv.x *= iResolution.x/iResolution.y;
        uv.x -= (iResolution.x/iResolution.y - 1.0) * 0.5;
        float mask = 0.0;
        float radius = .18;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.022).r;
        mask += paintCircle(uv,center,radius-.011,.006).r;
        mask += paintCircle(uv,center,radius+.011,.003).r;
        float hi = paintCircle(uv,center,radius,.003).r;
        vec2 v=rotate2d(iTime)*uv;
        // Brand-tinted ring (indigo/blue/cyan family).
        vec3 ringColor = vec3(0.31 + 0.25*v.x, 0.49 + 0.22*v.y, 1.0 - 0.18*v.y*v.x);
        // Soft ambient glow so the whole area is gently lit — no hard background box.
        float glow = smoothstep(0.55, 0.0, distance(uv, center)) * 0.16;
        vec3 col = ringColor*mask + vec3(0.85,0.90,1.0)*hi + vec3(0.31,0.49,1.0)*glow;
        float a = clamp(mask + hi + glow, 0.0, 1.0);
        // Transparent (premultiplied) output: the section's single background shows
        // through continuously; only the ring + glow are painted. uBackgroundColor is
        // intentionally unused now so there is no opaque rectangle / color break.
        gl_FragColor = vec4(col, a);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResLoc = gl.getUniformLocation(program, "iResolution");
    glBgColorLocationRef.current = gl.getUniformLocation(program, "uBackgroundColor");
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let animationFrameId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    // Size the canvas to its own box (the section), not the whole window.
    const handleResize = () => {
      const w = canvas.clientWidth || canvas.offsetWidth || 1;
      const h = canvas.clientHeight || canvas.offsetHeight || 1;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 block size-full opacity-95"
    />
  );
};

/* ── Pricing card ───────────────────────────────────────────────────────────── */
interface CardData {
  id: string;
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: "primary" | "secondary";
  contact?: boolean;
  badge?: string;
}

const PricingCard = ({
  data,
  onAction,
  busy,
  recommendedLabel,
}: {
  data: CardData;
  onAction: () => void;
  busy: boolean;
  recommendedLabel: string;
}) => {
  const { planName, description, price, features, buttonText, isPopular, buttonVariant = "primary", contact } = data;
  const isFree = price === "0";

  const cardBase =
    "group relative flex w-full max-w-[34rem] flex-1 flex-col rounded-[1.9rem] px-10 py-14 backdrop-blur-[40px] transition-all duration-300 ease-out hover:-translate-y-[10px]";
  // Real translucent glass: bright top edge (inset highlight), inner ring, layered depth.
  const cardGlass =
    "border border-white/70 bg-gradient-to-br from-white/62 to-white/26 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.28),0_38px_88px_-28px_rgba(20,30,60,0.5),0_16px_44px_-18px_rgba(20,30,60,0.34)] dark:border-white/15 dark:from-white/[0.14] dark:to-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_40px_94px_-30px_rgba(0,0,0,0.9),0_14px_44px_-22px_rgba(0,0,0,0.6)] hover:shadow-[0_50px_120px_-26px_var(--afglow)]";
  const cardPopular =
    "z-10 border-2 border-[var(--af)]/55 bg-gradient-to-br from-white/72 to-white/30 ring-1 ring-[var(--af)]/35 lg:scale-[1.12] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_64px_150px_-22px_var(--afglow),0_24px_70px_-26px_rgba(20,30,60,0.5),0_0_110px_-8px_var(--afglow)] dark:border-[var(--af)]/60 dark:from-white/[0.2] dark:to-white/[0.07] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_66px_160px_-24px_rgba(0,0,0,0.92),0_0_140px_-6px_var(--afglow)] hover:shadow-[0_80px_180px_-22px_var(--afglow),0_0_170px_-4px_var(--afglow)]";
  const cardClasses = cn(cardBase, isPopular ? cardPopular : cardGlass);

  const buttonClasses = cn(
    "mt-auto w-full rounded-xl py-4 text-[15px] font-bold tracking-[0.01em] transition-all duration-200 active:scale-[0.99]",
    buttonVariant === "primary"
      ? "text-white shadow-[0_14px_36px_-10px_var(--afglow)] [background:linear-gradient(110deg,var(--af),var(--af2))] hover:-translate-y-0.5 hover:brightness-[1.07] hover:shadow-[0_20px_48px_-10px_var(--afglow)]"
      : "border border-black/15 bg-white/40 text-foreground backdrop-blur-sm hover:bg-white/70 hover:shadow-[0_12px_30px_-14px_rgba(20,30,60,0.4)] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
  );

  return (
    <div
      className={cardClasses}
      style={{ "--af": BRAND, "--af2": BRAND_2, "--afglow": GLOW } as React.CSSProperties}
    >
      {/* Reflective glass sheen — top-left corner + brighter top edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(130%_80%_at_0%_0%,rgba(255,255,255,0.75),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.5),transparent_16%)] dark:bg-[radial-gradient(130%_80%_at_0%_0%,rgba(255,255,255,0.18),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_14%)]"
      />

      {isPopular && (
        <div
          className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold text-white shadow-[0_14px_32px_-8px_var(--afglow)]"
          style={{ background: `linear-gradient(110deg, ${BRAND}, ${BRAND_2})` }}
        >
          {data.badge ?? recommendedLabel}
        </div>
      )}

      <div className="relative mb-4">
        <h3 className="font-display text-[1.9rem] font-medium tracking-[-0.02em] text-foreground">{planName}</h3>
        <p className="mt-2 min-h-[3.25rem] text-[16px] leading-relaxed text-foreground/75">{description}</p>
      </div>

      <div className="relative my-7 flex items-baseline gap-1.5">
        <span className="font-display text-[3.5rem] font-bold leading-none tracking-tight text-foreground">${price}</span>
        {!isFree && <span className="text-[15px] text-foreground/60">/mo</span>}
      </div>

      <div className="relative mb-7 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.1)_50%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2)_50%,transparent)]" />

      <ul className="relative mb-10 flex flex-col gap-4 text-[16px] text-foreground/90">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckIcon className="size-[18px] shrink-0" style={{ color: BRAND } as React.CSSProperties} />
            <span className="min-w-0">{feature}</span>
          </li>
        ))}
      </ul>

      {contact ? (
        <RippleButton href={CONTACT_HREF} className={cn("relative", buttonClasses)}>
          {buttonText}
        </RippleButton>
      ) : (
        <RippleButton className={cn("relative", buttonClasses)} onClick={onAction} disabled={busy}>
          {busy ? "…" : buttonText}
        </RippleButton>
      )}
    </div>
  );
};

/* ── Section (drop-in replacement, keeps the {withHeading} contract) ─────────── */
export function PricingSection({ withHeading = true }: { withHeading?: boolean }) {
  const router = useRouter();
  const { t, locale } = useT();
  const isRu = locale === "ru";
  const [selecting, setSelecting] = useState<string | null>(null);
  const tiers = getPricingTiers(isRu ? "ru" : "en");

  const onSelect = async (tierId: string) => {
    if (selecting) return;
    const authed = getUserState().authenticated;
    if (tierId === "free") {
      if (authed) setSubscription("free", false);
      router.push(authed ? "/dashboard" : "/signup");
      return;
    }
    if (!authed) {
      router.push("/login");
      return;
    }
    setSelecting(tierId);
    setSubscription(tierId as Plan, true);
    try {
      const { isSupabaseConfigured } = await import("@/lib/supabase/config");
      if (isSupabaseConfigured()) {
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000));
        await Promise.race([
          (async () => {
            const { savePlan } = await import("@/lib/supabase/data");
            await savePlan(tierId as Plan, "active");
            const { hydrateLocalFromProfile } = await import("@/lib/supabase/auth");
            await hydrateLocalFromProfile();
          })(),
          timeout,
        ]);
      }
    } catch {
      /* proceed — the gate re-checks and the local store already reflects it */
    }
    window.location.assign("/dashboard");
  };

  const cards: CardData[] = tiers.map((tier) => ({
    id: tier.id,
    planName: tier.name,
    description: tier.tagline,
    price: String(tier.price.monthly),
    features: tier.features,
    buttonText: tier.cta,
    isPopular: tier.highlight,
    buttonVariant: tier.variant,
    contact: tier.contact,
    badge: tier.badge,
  }));

  return (
    <section id="pricing" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-20">
      {/* Animated glassy shader ring — the pricing-section branding. */}
      <ShaderCanvas />

      <div className="relative z-10 mx-auto w-full max-w-[92rem] px-6">
        {withHeading && (
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <h2 className="font-display text-[3.1rem] font-medium leading-[1.02] tracking-[-0.032em] text-balance sm:text-[4.5rem]">
              {isRu ? "Выберите свой" : "Choose Your"}
              <br />
              <span
                className="bg-clip-text italic text-transparent"
                style={{ backgroundImage: `linear-gradient(100deg, ${BRAND}, ${BRAND_2})` }}
              >
                {isRu ? "план поступления" : "Admission Plan"}
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-lg text-lg text-muted-foreground text-pretty">
              {isRu
                ? "Всё, что нужно, чтобы пройти путь от поиска вузов до зачисления."
                : "Everything you need to go from university discovery to admission."}
            </p>
          </div>
        )}

        <div className={cn("flex flex-col items-stretch justify-center gap-8 pt-6 lg:flex-row lg:gap-10", !withHeading && "mt-2")}>
          {cards.map((card) => (
            <PricingCard
              key={card.id}
              data={card}
              busy={selecting === card.id}
              onAction={() => onSelect(card.id)}
              recommendedLabel={t("pricing.popular")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
