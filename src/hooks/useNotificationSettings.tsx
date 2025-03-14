
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NotificationSetting } from './types/user-settings-types';
import { toast } from 'sonner';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  
  const notificationTypes = [
    "Order Created", 
    "Order Status Change",
    "Order Assigned",
    "Payment Received", 
    "Client Message",
    "System Alert"
  ];
  
  // Initialize with default notification settings
  const defaultSettings: NotificationSetting[] = notificationTypes.map((type, index) => ({
    id: `notification-${index}`,
    name: type,
    description: `Notification for when a ${type.toLowerCase()} occurs`,
    enabled: true,
    type: type,
    channels: {
      email: false,
      sms: false,
      push: false
    }
  }));
  
  const fetchNotificationSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.log('No authenticated user found');
        setSettings(defaultSettings);
        return;
      }
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'notification_settings')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching notification settings:', error);
        setSettings(defaultSettings);
        return;
      }
      
      if (data && data.value) {
        // Cast the data to ensure it matches our NotificationSetting type
        setSettings(data.value as NotificationSetting[]);
      } else {
        console.log('No notification settings found, using defaults');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);
  
  const updateChannelForType = (type: string, channel: 'email' | 'sms' | 'push', enabled: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.type === type 
          ? { 
              ...setting, 
              channels: { 
                ...setting.channels, 
                [channel]: enabled 
              } 
            } 
          : setting
      )
    );
    
    // In a real app, you'd save this to the database
    toast.success(`${channel} notifications ${enabled ? 'enabled' : 'disabled'} for ${type}`);
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
