
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const OrderDetailsLoading: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
};
