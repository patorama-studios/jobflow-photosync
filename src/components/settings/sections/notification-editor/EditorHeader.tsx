
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { useAuth } from '@/contexts/AuthContext';

export const EditorHeader: React.FC<{ isAuthenticated?: boolean }> = ({ isAuthenticated }) => {
  const { refreshTemplates } = useNotificationTemplates();
  const { user } = useAuth();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Editor</h2>
        <p className="text-muted-foreground">
          Customize notification templates for emails, SMS, and push notifications
        </p>
        {!user && isAuthenticated === false && (
          <p className="text-sm text-amber-500 mt-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Please log in to edit notifications
          </p>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshTemplates}
        disabled={!user && isAuthenticated === false}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};
