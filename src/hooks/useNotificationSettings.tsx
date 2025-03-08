
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface NotificationChannel {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface NotificationSetting {
  type: string;
  channels: NotificationChannel;
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const notificationTypes = [
    "Appointment Assigned",
    "Appointment Canceled",
    "Appointment Postponed",
    "Appointment Reminder",
    "Appointment Rescheduled",
    "Appointment Scheduled",
    "Appointment Summary",
    "Appointment Unassigned",
    "Customer Team Invitation",
    "Order Payment Processed",
    "Order Received",
    "Team Member Invitation",
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'notification_preferences')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setSettings(data.value as NotificationSetting[]);
        } else {
          // Initialize with default settings
          const defaultSettings = notificationTypes.map(type => ({
            type,
            channels: {
              email: type.includes("Payment") || type.includes("Order") || type.includes("Invitation"),
              sms: false,
              push: false
            }
          }));

          setSettings(defaultSettings);

          // Save default settings to database
          await supabase
            .from('app_settings')
            .insert({
              key: 'notification_preferences',
              value: defaultSettings,
              user_id: user.id,
              is_global: false
            });
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings: NotificationSetting[]) => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if setting exists first
      const { data, error: checkError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'notification_preferences')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw checkError;
      }

      if (data) {
        // Update existing setting
        const { error } = await supabase
          .from('app_settings')
          .update({ 
            value: newSettings,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'notification_preferences')
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('app_settings')
          .insert({
            key: 'notification_preferences',
            value: newSettings,
            user_id: user.id,
            is_global: false
          });

        if (error) throw error;
      }

      setSettings(newSettings);
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateChannelForType = (type: string, channel: keyof NotificationChannel, value: boolean) => {
    const newSettings = settings.map(setting => {
      if (setting.type === type) {
        return {
          ...setting,
          channels: {
            ...setting.channels,
            [channel]: value
          }
        };
      }
      return setting;
    });
    
    updateSettings(newSettings);
  };

  return {
    settings,
    loading,
    updateSettings,
    updateChannelForType,
    notificationTypes
  };
}
