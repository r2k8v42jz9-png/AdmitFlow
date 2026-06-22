import type { Metadata } from "next";
import { PageContainer } from "@/components/app/page-header";
import { LocalizedPageHeader } from "@/components/app/localized-page-header";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Your AI-generated, month-by-month admissions roadmap with milestones and tasks.",
};

export default function RoadmapPage() {
  return (
    <PageContainer>
      <LocalizedPageHeader titleKey="page.roadmap.title" descKey="page.roadmap.desc" />
      <div className="mt-7">
        <RoadmapTimeline />
      </div>
    </PageContainer>
  );
}
