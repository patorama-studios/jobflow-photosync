
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JsonValue } from './types/user-settings-types';

export function useAppSettings<T>(settingKey: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setValue(defaultValue);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', settingKey)
          .eq('user_id', userData.user.id)
          .maybeSingle();
        
        if (error) {
          console.error(`Error fetching ${settingKey} setting:`, error);
          setValue(defaultValue);
          return;
        }
        
        if (data && data.value) {
          setValue(data.value as unknown as T);
        } else {
          setValue(defaultValue);
          // Save default value to database
          await saveSetting(defaultValue);
        }
      } catch (error) {
        console.error(`Error fetching ${settingKey} setting:`, error);
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSetting();
  }, [settingKey, defaultValue]);

  const saveSetting = useCallback(async (newValue: T) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: settingKey,
          value: newValue as unknown as JsonValue,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`Error saving ${settingKey} setting:`, error);
        toast.error('Failed to save settings');
        return false;
      }
      
      // Update local state
      setValue(newValue);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error(`Error saving ${settingKey} setting:`, error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }, [settingKey]);

  return {
    value,
    setValue: saveSetting,
    loading
  };
}
