import { cn } from "@/lib/utils";

/**
 * Theme-aware ambient background layer (light/dark WebP from public/assets/ambient).
 * Decorative only — static, so it inherently respects prefers-reduced-motion
 * (no animation to disable). The parent controls positioning, z-index and opacity
 * via `className`; this layer never affects document flow.
 */
export function AmbientLayer({
  light,
  dark,
  className,
  imgClassName,
  eager = false,
}: {
  light: string;
  dark: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const loading = eager ? "eager" : "lazy";
  return (
    <div aria-hidden className={cn("pointer-events-none overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={light}
        alt=""
        loading={loading}
        decoding="async"
        className={cn("absolute inset-0 size-full object-cover dark:hidden", imgClassName)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark}
        alt=""
        loading={loading}
        decoding="async"
        className={cn("absolute inset-0 hidden size-full object-cover dark:block", imgClassName)}
      />
    </div>
  );
}
