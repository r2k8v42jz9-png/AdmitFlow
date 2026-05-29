import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";
import { AppGate } from "@/components/app/app-gate";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppGate>
      <AppShell>{children}</AppShell>
    </AppGate>
  );
}
