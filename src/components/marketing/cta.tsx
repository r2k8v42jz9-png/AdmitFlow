import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/30 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_120%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-40" />

            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
              <GraduationCap className="size-4 text-primary" /> Plans from $15/mo — cancel anytime
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-medium tracking-[-0.018em] text-balance sm:text-5xl">
              Your dream university is <span className="italic text-primary">closer than you think</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Join 128,000+ students who plan smarter, apply with confidence and get in. Build your
              personalized admission plan in under two minutes.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="gradient" size="xl">
                <Link href="/signup">
                  Build my plan <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
