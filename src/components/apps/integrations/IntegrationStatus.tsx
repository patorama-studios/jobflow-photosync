
import React from 'react';
import { Label } from "@/components/ui/label";

interface IntegrationStatusProps {
  lastSynced?: string;
}

export function IntegrationStatus({ lastSynced }: IntegrationStatusProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <Label htmlFor="connection-status">Connection</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-600 font-medium">Active</span>
          <div className="h-2 w-2 rounded-full bg-green-600"></div>
        </div>
      </div>
      
      <div className="space-y-1">
        <Label>Last synchronized</Label>
        <p className="text-sm text-muted-foreground">
          {lastSynced || 'Never'}
        </p>
      </div>
    </>
  );
}
