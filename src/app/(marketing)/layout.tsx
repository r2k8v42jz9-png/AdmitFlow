import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { MotionProvider } from "@/components/providers/motion-provider";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SmoothScroll />
      <SiteHeader />
      <main className="flex-1">
        <MotionProvider>{children}</MotionProvider>
      </main>
      <SiteFooter />
    </div>
  );
}
