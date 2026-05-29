import { PageContainer } from "@/components/app/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function UniversityDetailLoading() {
  return (
    <PageContainer>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-6 h-44 rounded-2xl" />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="mt-6 h-10 w-full max-w-md rounded-xl" />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </PageContainer>
  );
}
