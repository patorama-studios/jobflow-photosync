
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from 'lucide-react';

interface IntegrationControlsProps {
  id: string;
  isSyncLoading: boolean;
  handleSync: () => void;
  handleOpenService?: () => void;
}

export function IntegrationControls({ 
  id, 
  isSyncLoading, 
  handleSync,
  handleOpenService
}: IntegrationControlsProps) {
  return (
    <div className="pt-2 space-y-2">
      <Button 
        className="w-full"
        onClick={handleSync}
        disabled={isSyncLoading}
      >
        {isSyncLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Now
          </>
        )}
      </Button>
      
      {id === 'box' && handleOpenService && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleOpenService}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Box.com
        </Button>
      )}
      
      {id === 'stripe' && handleOpenService && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleOpenService}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Stripe Dashboard
        </Button>
      )}
    </div>
  );
}
