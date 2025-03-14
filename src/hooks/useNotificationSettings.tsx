
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NotificationSetting, JsonValue } from './types/user-settings-types';

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
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setSettings(createDefaultSettings(notificationTypes));
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'notification_preferences')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
        // Initialize with default settings if there's an error
        setSettings(createDefaultSettings(notificationTypes));
        setLoading(false);
        return;
      }
      
      if (data && data.value) {
        // Properly cast the JSON value to the expected type
        const parsedSettings = data.value as unknown as NotificationSetting[];
        console.log('Loaded notification settings from Supabase:', parsedSettings);
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
  
  const updateChannelForType = useCallback(async (type: string, channel: 'email' | 'sms' | 'push', value: boolean) => {
    // Create a new array with the updated setting
    const updatedSettings = settings.map(setting => 
      setting.type === type 
        ? { ...setting, channels: { ...setting.channels, [channel]: value } } 
        : setting
    );
    
    // Update local state
    setSettings(updatedSettings);
    
    // Save changes to Supabase
    const success = await saveNotificationSettings(updatedSettings);
    
    if (success) {
      toast.success(`${type} ${channel} notifications ${value ? 'enabled' : 'disabled'}`);
    }
  }, [settings]);
  
  const saveNotificationSettings = async (updatedSettings: NotificationSetting[]) => {
    try {
      console.log('Saving notification settings to Supabase:', updatedSettings);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'notification_preferences',
          value: updatedSettings as unknown as JsonValue,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving notification settings:', error);
        toast.error('Failed to save notification settings');
        return false;
      }
      
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
    saveNotificationSettings,
    fetchNotificationSettings
  };
}
