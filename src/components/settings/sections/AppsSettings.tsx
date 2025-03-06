
import React, { memo } from "react";
import { AppsOverview } from "@/components/apps/AppsOverview";

export const AppsSettings = memo(function AppsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground">
          Connect Patorama Studios with your favorite tools and services
        </p>
      </div>
      
      <div className="mt-6">
        <AppsOverview hideHeader={true} />
      </div>
    </div>
  );
});
