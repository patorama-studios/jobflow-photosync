
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrganizationSettings } from './types/user-settings-types';

const defaultSettings: OrganizationSettings = {
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  website: ''
};

export function useOrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'organization_settings')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching organization settings:', error);
          return;
        }
        
        if (data && data.value) {
          setSettings({
            ...defaultSettings,
            ...data.value as object
          });
        }
      } catch (error) {
        console.error('Failed to fetch organization settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const updateSettings = useCallback(async (newSettings: Partial<OrganizationSettings>): Promise<boolean> => {
    try {
      // Update local state
      setSettings(prev => ({
        ...prev,
        ...newSettings
      }));
      
      // Save to database if we have a user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return false;
      }
      
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'organization_settings',
          value: updatedSettings,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving organization settings:', error);
        toast.error('Failed to save organization settings');
        return false;
      }
      
      toast.success('Organization settings saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to update organization settings:', error);
      return false;
    }
  }, [settings]);
  
  return {
    settings,
    loading,
    updateSettings
  };
}
