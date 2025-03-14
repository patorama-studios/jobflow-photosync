
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';

export const LoadingState: React.FC = () => {
  const { loadRetry, refreshTemplates } = useNotificationTemplates();
  
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p>Loading notification templates...</p>
      {loadRetry > 1 && (
        <Button variant="outline" size="sm" onClick={refreshTemplates}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading
        </Button>
      )}
    </div>
  );
};
