
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OrderDetailsLoading: React.FC = () => {
  return (
    <div className="container py-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Order details skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Refunds skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-24 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>

      {/* Contractors skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
