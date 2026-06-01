"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.description")}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="gradient">
            <RotateCw className="size-4" /> {t("error.retry")}
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Home className="size-4" /> {t("error.dashboard")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
