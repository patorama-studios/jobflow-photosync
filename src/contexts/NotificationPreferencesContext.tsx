
import React, { createContext, useContext, useEffect } from 'react';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { NotificationSetting } from '@/hooks/types/user-settings-types';

interface NotificationPreferencesContextType {
  settings: NotificationSetting[];
  loading: boolean;
  updateChannelForType: (type: string, channel: 'email' | 'sms' | 'push', enabled: boolean) => void;
  notificationTypes: string[];
  refreshSettings: () => void;
  error: boolean;
}

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

export const useNotificationPreferences = () => {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error('useNotificationPreferences must be used within a NotificationPreferencesProvider');
  }
  return context;
};

export const NotificationPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    settings, 
    loading, 
    updateChannelForType,
    notificationTypes,
    fetchNotificationSettings 
  } = useNotificationSettings();
  
  const error = !loading && (!settings || settings.length === 0);

  useEffect(() => {
    // Force refresh the notification settings when component mounts
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  return (
    <NotificationPreferencesContext.Provider 
      value={{ 
        settings, 
        loading, 
        updateChannelForType, 
        notificationTypes,
        refreshSettings: fetchNotificationSettings,
        error
      }}
    >
      {children}
    </NotificationPreferencesContext.Provider>
  );
};
