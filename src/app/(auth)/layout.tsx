import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Quote, Star, Sparkles, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { AuroraBackground } from "@/components/shared/aurora-background";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 p-12 lg:flex">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <div className="space-y-4">
            <Quote className="size-9 text-primary/60" />
            <p className="font-display text-2xl font-medium leading-snug tracking-tight">
              &ldquo;AdmitFlow&apos;s estimator told me exactly where I stood. I rebuilt my list and
              got into <span className="text-gradient">ETH Zürich</span> with a scholarship I didn&apos;t
              know existed.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))] text-sm font-semibold text-white">
                MR
              </span>
              <div>
                <p className="text-sm font-semibold">Maya Rashidova</p>
                <p className="text-xs text-muted-foreground">Admitted · ETH Zürich &apos;27</p>
              </div>
              <span className="ml-auto flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {[
              { v: "128k+", l: "students" },
              { v: "3.2×", l: "better odds" },
              { v: "1,400+", l: "universities" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-xl font-bold text-gradient">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> SOC 2 secure</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="size-3.5" /> AI-powered guidance</span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-10">
        <AuroraBackground variant="subtle" className="lg:hidden" />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
