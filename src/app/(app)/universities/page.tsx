import type { Metadata } from "next";
import { PageContainer } from "@/components/app/page-header";
import { LocalizedPageHeader } from "@/components/app/localized-page-header";
import { UniversitiesTabs } from "@/components/universities/universities-tabs";

export const metadata: Metadata = {
  title: "Universities",
  description: "Explore top universities, compare AI fit scores and find your best-match programs.",
};

export default function UniversitiesPage() {
  return (
    <PageContainer>
      <LocalizedPageHeader titleKey="page.universities.title" descKey="page.universities.desc" />
      <div className="mt-7">
        <UniversitiesTabs />
      </div>
    </PageContainer>
  );
}
