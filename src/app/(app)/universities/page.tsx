import type { Metadata } from "next";
import { PageContainer } from "@/components/app/page-header";
import { LocalizedPageHeader } from "@/components/app/localized-page-header";
import { UniversityExplorer } from "@/components/universities/university-explorer";

export const metadata: Metadata = {
  title: "Universities",
  description: "Explore top universities, compare AI fit scores and find your best-match programs.",
};

export default function UniversitiesPage() {
  return (
    <PageContainer>
      <LocalizedPageHeader titleKey="page.universities.title" descKey="page.universities.desc" />
      <div className="mt-7">
        <UniversityExplorer />
      </div>
    </PageContainer>
  );
}
