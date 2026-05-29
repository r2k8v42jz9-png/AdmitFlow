import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-xl bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet))_60%,hsl(var(--brand-pink)))] text-white shadow-[0_6px_22px_-6px_hsl(var(--brand-violet)/0.8)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[58%]" aria-hidden>
        <path
          d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M6.5 10.2v4.1c0 .7.4 1.3 1 1.6l3.6 1.8c.6.3 1.2.3 1.8 0l3.6-1.8c.6-.3 1-.9 1-1.6v-4.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fillOpacity="0"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  size = "default",
}: {
  className?: string;
  href?: string | null;
  size?: "sm" | "default" | "lg";
}) {
  const dims = {
    sm: { mark: "size-7", text: "text-base" },
    default: { mark: "size-9", text: "text-lg" },
    lg: { mark: "size-11", text: "text-2xl" },
  }[size];

  const content = (
    <span className={cn("flex items-center gap-2.5 font-display font-semibold tracking-tight", className)}>
      <LogoMark className={dims.mark} />
      <span className={cn(dims.text, "text-foreground")}>
        Admit<span className="text-gradient">Flow</span>
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="group inline-flex outline-none">
      {content}
    </Link>
  );
}
