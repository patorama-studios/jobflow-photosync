
import React from 'react';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';
import { NotificationTypeItem } from './NotificationTypeItem';

interface NotificationChannelTabProps {
  channel: 'email' | 'sms' | 'push';
}

export const NotificationChannelTab: React.FC<NotificationChannelTabProps> = ({ channel }) => {
  const { notificationTypes } = useNotificationPreferences();

  return (
    <div className="space-y-4">
      {notificationTypes.map((type) => (
        <NotificationTypeItem 
          key={`${channel}-${type}`} 
          type={type} 
          channel={channel} 
        />
      ))}
    </div>
  );
};
