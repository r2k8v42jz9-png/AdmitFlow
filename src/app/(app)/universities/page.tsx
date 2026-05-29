import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { UniversityExplorer } from "@/components/universities/university-explorer";

export const metadata: Metadata = {
  title: "Universities",
  description: "Explore top universities, compare AI fit scores and find your best-match programs.",
};

export default function UniversitiesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="University Explorer"
        description="Browse world-class universities, compare AI fit scores, tuition and admission odds — then bookmark your shortlist."
      />
      <div className="mt-7">
        <UniversityExplorer />
      </div>
    </PageContainer>
  );
}
