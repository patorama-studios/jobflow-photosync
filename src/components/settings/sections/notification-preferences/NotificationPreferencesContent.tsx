
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationChannelTab } from './NotificationChannelTab';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { NotificationPreferencesHeader } from './NotificationPreferencesHeader';
import { SaveButton } from './SaveButton';

export const NotificationPreferencesContent: React.FC = () => {
  const { loading, error } = useNotificationPreferences();
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="space-y-6">
      <NotificationPreferencesHeader />
      
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="pt-4">
          <NotificationChannelTab channel="email" />
        </TabsContent>
        
        <TabsContent value="sms" className="pt-4">
          <NotificationChannelTab channel="sms" />
        </TabsContent>
        
        <TabsContent value="push" className="pt-4">
          <NotificationChannelTab channel="push" />
        </TabsContent>
      </Tabs>
      
      <SaveButton />
    </div>
  );
};
