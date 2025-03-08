
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
