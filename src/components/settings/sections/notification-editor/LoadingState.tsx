
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { useAuth } from '@/contexts/AuthContext';

export const LoadingState: React.FC<{ isAuthenticated?: boolean }> = ({ isAuthenticated }) => {
  const { loadRetry, refreshTemplates } = useNotificationTemplates();
  const { user } = useAuth();
  
  // If not authenticated, show login message
  if (!user && isAuthenticated === false) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <AlertCircle className="h-8 w-8 text-amber-500" />
        <p>Please log in to view notification templates</p>
        <p className="text-sm text-muted-foreground">Settings are only available for authenticated users</p>
      </div>
    );
  }
  
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
