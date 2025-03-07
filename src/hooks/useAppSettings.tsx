
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AppSettingsValue = Record<string, any>;

export function useAppSettings(key: string, defaultValue: AppSettingsValue = {}) {
  const [value, setValue] = useState<AppSettingsValue>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [lastSavedValue, setLastSavedValue] = useState<string>('');

  // Fetch settings from Supabase on component mount
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', key)
          .maybeSingle();

        if (error) throw error;
        
        if (isMounted) {
          if (data) {
            // Ensure we're setting an object type for AppSettingsValue
            const parsedValue = typeof data.value === 'object' ? data.value : JSON.parse(String(data.value));
            setValue(parsedValue);
            setLastSavedValue(JSON.stringify(parsedValue));
          } else {
            // If no settings found, use default and save it
            await saveSettings(defaultValue, false);
            setValue(defaultValue);
            setLastSavedValue(JSON.stringify(defaultValue));
          }
        }
      } catch (err) {
        console.error('Error fetching app settings:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          // Fallback to default values if fetch fails
          setValue(defaultValue);
          setLastSavedValue(JSON.stringify(defaultValue));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [key, defaultValue]);

  // Save settings to Supabase
  const saveSettings = useCallback(async (newValue: AppSettingsValue, showToast = true) => {
    // Avoid unnecessary saves if the value hasn't changed
    const newValueString = JSON.stringify(newValue);
    if (newValueString === lastSavedValue) {
      return;
    }
    
    try {
      setIsLoading(true);

      // Check if setting exists
      const { data: existingData } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      let result;

      if (existingData) {
        // Update existing setting
        result = await supabase
          .from('app_settings')
          .update({ 
            value: newValue,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);
      } else {
        // Insert new setting
        result = await supabase
          .from('app_settings')
          .insert({ 
            key,
            value: newValue,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            is_global: false
          });
      }

      if (result.error) throw result.error;
      
      setValue(newValue);
      setLastSavedValue(newValueString);
      
      if (showToast) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated",
        });
      }
    } catch (err) {
      console.error('Error saving app settings:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      if (showToast) {
        toast({
          title: "Error saving settings",
          description: "There was a problem saving your preferences",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [key, toast, lastSavedValue]);

  return {
    value,
    setValue: saveSettings,
    isLoading,
    error
  };
}
