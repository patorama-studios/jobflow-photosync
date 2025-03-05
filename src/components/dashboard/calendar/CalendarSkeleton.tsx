
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CalendarSkeleton() {
  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Calendar</span>
          <Badge variant="outline" className="animate-pulse">Loading...</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-muted rounded-lg"></div>
          <div className="mt-4 h-4 w-48 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
