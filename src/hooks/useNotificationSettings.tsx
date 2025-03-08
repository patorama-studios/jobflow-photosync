
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NotificationSetting } from './types/user-settings-types';

const DEFAULT_NOTIFICATION_TYPES = [
  'Order Created',
  'Order Updated',
  'Order Completed',
  'Payment Received',
  'New Message',
  'Task Assignment',
  'Deadline Approaching',
  'System Maintenance'
];

// Create default notification settings with all channels off
const createDefaultSettings = (types: string[]): NotificationSetting[] => {
  return types.map(type => ({
    type,
    channels: {
      email: false,
      sms: false,
      push: false
    }
  }));
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationTypes] = useState<string[]>(DEFAULT_NOTIFICATION_TYPES);

  const fetchNotificationSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'notification_preferences')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
        // Initialize with default settings if there's an error
        setSettings(createDefaultSettings(notificationTypes));
        return;
      }
      
      if (data && data.value) {
        const parsedSettings = data.value as NotificationSetting[];
        setSettings(parsedSettings);
      } else {
        // No settings found, create default ones
        const defaultSettings = createDefaultSettings(notificationTypes);
        setSettings(defaultSettings);
        
        // Save default settings to database
        await saveNotificationSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Unexpected error loading notification settings:', error);
      toast.error('An unexpected error occurred while loading notification settings');
      setSettings(createDefaultSettings(notificationTypes));
    } finally {
      setLoading(false);
    }
  }, [notificationTypes]);
  
  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);
  
  const updateChannelForType = useCallback((type: string, channel: 'email' | 'sms' | 'push', value: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.type === type 
          ? { ...setting, channels: { ...setting.channels, [channel]: value } } 
          : setting
      )
    );
    
    // Save changes
    saveNotificationSettings(settings.map(setting => 
      setting.type === type 
        ? { ...setting, channels: { ...setting.channels, [channel]: value } } 
        : setting
    ));
  }, [settings]);
  
  const saveNotificationSettings = async (updatedSettings: NotificationSetting[]) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'notification_preferences',
          value: updatedSettings,
        });
      
      if (error) {
        console.error('Error saving notification settings:', error);
        toast.error('Failed to save notification settings');
        return false;
      }
      
      toast.success('Notification settings saved successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error saving notification settings:', error);
      toast.error('An unexpected error occurred while saving notification settings');
      return false;
    }
  };
  
  return {
    settings,
    loading,
    updateChannelForType,
    notificationTypes,
  };
}
