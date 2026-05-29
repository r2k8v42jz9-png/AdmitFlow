import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app/page-header";
import { UniversityDetail } from "@/components/universities/university-detail";
import { getUniversity, universities } from "@/lib/data/universities";

export function generateStaticParams() {
  return universities.map((u) => ({ id: u.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const u = getUniversity(id);
  if (!u) return { title: "University not found" };
  return {
    title: u.name,
    description: u.blurb,
  };
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const university = getUniversity(id);
  if (!university) notFound();

  return (
    <PageContainer>
      <UniversityDetail university={university} />
    </PageContainer>
  );
}
