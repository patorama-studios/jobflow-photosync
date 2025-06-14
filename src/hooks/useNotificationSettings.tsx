
import { useState, useCallback, useEffect } from 'react';
import { NotificationSetting } from './types/user-settings-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/MySQLAuthContext';
import { notificationService } from '@/services/mysql/notification-service';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  
  const notificationTypes = [
    "Order Created", 
    "Order Status Change",
    "Order Assigned",
    "Payment Received", 
    "Client Message",
    "System Alert"
  ];
  
  const fetchNotificationSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!user || !session) {
        console.log('🔧 No authenticated user found');
        setLoading(false);
        return;
      }
      
      console.log('🔧 Fetching notification settings for user:', user.id);
      const userSettings = await notificationService.getNotificationSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('🔧 Failed to fetch notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  }, [user, session]);
  
  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);
  
  const updateChannelForType = async (type: string, channel: 'email' | 'sms' | 'push', enabled: boolean) => {
    if (!user || !session) {
      toast.error('You must be logged in to update notification settings');
      return;
    }

    try {
      console.log('🔧 Updating notification channel:', { type, channel, enabled });
      
      const updatedSettings = await notificationService.updateChannelForType(user.id, type, channel, enabled);
      setSettings(updatedSettings);
      
      toast.success(`${channel} notifications ${enabled ? 'enabled' : 'disabled'} for ${type}`);
    } catch (error) {
      console.error('🔧 Failed to update notification settings:', error);
      toast.error('Failed to save notification settings');
    }
  };
  
  return {
    settings,
    loading,
    updateChannelForType,
    notificationTypes,
    fetchNotificationSettings
  };
};

export default useNotificationSettings;
