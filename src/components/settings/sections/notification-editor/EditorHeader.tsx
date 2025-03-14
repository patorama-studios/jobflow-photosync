
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';

export const EditorHeader: React.FC = () => {
  const { refreshTemplates } = useNotificationTemplates();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Editor</h2>
        <p className="text-muted-foreground">
          Customize notification templates for emails, SMS, and push notifications
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={refreshTemplates}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};
