import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuroraBackground } from "@/components/shared/aurora-background";

export const metadata: Metadata = { title: "Set up your profile" };

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AuroraBackground variant="subtle" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
