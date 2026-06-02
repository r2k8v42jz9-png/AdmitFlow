import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app/page-header";
import { UniversityDetail } from "@/components/universities/university-detail";
import { getUniversityByIdServer } from "@/lib/supabase/universities.server";

// Rendered dynamically: data comes from Supabase (with a bundled-catalog
// fallback inside getUniversityByIdServer).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const u = await getUniversityByIdServer(id);
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
  const university = await getUniversityByIdServer(id);
  if (!university) notFound();

  return (
    <PageContainer>
      <UniversityDetail university={university} />
    </PageContainer>
  );
}
