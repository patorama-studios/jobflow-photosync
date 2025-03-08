
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrganizationSettings } from './types/user-settings-types';

const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  companyName: '',
  website: '',
  supportEmail: '',
  companyPhone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  companyTimezone: '',
  companyAddress: '',
  addressFormat: '',
};

export function useOrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>(DEFAULT_ORGANIZATION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'organization_settings')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching organization settings:', error);
          toast.error('Failed to load organization settings');
          return;
        }
        
        if (data && data.value) {
          // Properly cast the JSON value to the expected type
          setSettings(data.value as unknown as OrganizationSettings);
        } else {
          // No settings found, use defaults
          setSettings(DEFAULT_ORGANIZATION_SETTINGS);
        }
      } catch (error) {
        console.error('Unexpected error loading organization settings:', error);
        toast.error('An unexpected error occurred while loading organization settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const updateSettings = (updatedSettings: Partial<OrganizationSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };
  
  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save the settings object directly as a JSON value
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'organization_settings',
          value: settings as unknown as any,
        });
      
      if (error) {
        console.error('Error saving organization settings:', error);
        toast.error('Failed to save organization settings');
        return false;
      }
      
      toast.success('Organization settings saved successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error saving organization settings:', error);
      toast.error('An unexpected error occurred while saving organization settings');
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    settings,
    loading,
    saving,
    updateSettings,
    saveSettings,
  };
}
