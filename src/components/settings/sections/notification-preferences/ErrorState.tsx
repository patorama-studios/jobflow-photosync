
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';

export const ErrorState: React.FC = () => {
  const { refreshSettings } = useNotificationPreferences();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Could not load notification settings</h3>
      <p className="text-muted-foreground mb-4 text-center">
        There was a problem loading your notification preferences. Please try again later.
      </p>
      <Button onClick={() => refreshSettings()}>Refresh Settings</Button>
    </div>
  );
};
