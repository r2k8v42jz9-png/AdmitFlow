"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const links = [
  { key: "nav.product", href: "/#features" },
  { key: "nav.universities", href: "/universities" },
  { key: "nav.pricing", href: "/pricing" },
  { key: "nav.stories", href: "/#testimonials" },
  { key: "nav.faq", href: "/#faq" },
];

export function SiteHeader() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <div
        className={cn(
          "flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass-strong border-border/80 shadow-card"
            : "border-transparent bg-transparent",
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle className="hidden sm:grid" />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">{t("common.signIn")}</Link>
          </Button>
          <Button asChild variant="gradient" size="sm" className="hidden sm:inline-flex">
            <Link href="/signup">
              {t("common.getStarted")} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-lg border border-border/70 bg-card/50 text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-[4.5rem] z-50 rounded-2xl glass-strong p-3 shadow-card lg:hidden"
          >
            <nav className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-accent"
                >
                  {t(l.key)}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/login">{t("common.signIn")}</Link>
              </Button>
              <Button asChild variant="gradient" size="sm" className="flex-1">
                <Link href="/signup">{t("common.getStarted")}</Link>
              </Button>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
