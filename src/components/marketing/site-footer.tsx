import Link from "next/link";
import { Globe, MessageCircle, AtSign, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { trustBadges } from "@/lib/data/marketing";

const columns = [
  {
    title: "Product",
    links: [
      { label: "AI Mentor", href: "/mentor" },
      { label: "University Explorer", href: "/universities" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Blog", href: "/#" },
      { label: "Press", href: "/#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Admission guide", href: "/#" },
      { label: "Scholarship database", href: "/#" },
      { label: "Help center", href: "/#" },
      { label: "Community", href: "/#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/#" },
      { label: "Terms", href: "/#" },
      { label: "Security", href: "/#" },
      { label: "Cookies", href: "/#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              The AI admission mentor helping ambitious students get into the world&apos;s best
              universities — from chance estimates to acceptance.
            </p>
            <div className="flex items-center gap-2">
              {[AtSign, MessageCircle, Globe].map((Icon, i) => (
                <span
                  key={i}
                  className="grid size-9 place-items-center rounded-lg border border-border/70 bg-card/50 text-muted-foreground/60"
                  aria-hidden
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AdmitFlow, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {trustBadges.map((b) => (
              <span key={b} className="text-xs text-muted-foreground/80">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
