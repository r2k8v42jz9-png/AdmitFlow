import { PageContainer } from "@/components/app/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function UniversitiesLoading() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Skeleton className="h-11 flex-1 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-28 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
          <Skeleton className="h-11 w-24 rounded-lg" />
        </div>
      </div>

      <Skeleton className="mt-5 h-4 w-40" />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </PageContainer>
  );
}
