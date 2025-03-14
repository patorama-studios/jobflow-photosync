
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrganizationSettings } from './types/user-settings-types';
import { toast } from 'sonner';

// Default organization settings
const defaultSettings: OrganizationSettings = {
  name: '',
  logo: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  taxId: '',
  timezone: 'America/New_York',
  city: '',
  state: '',
  addressFormat: 'standard'
};

export const useOrganizationSettings = () => {
  const [settings, setSettings] = useState<OrganizationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Fetch organization settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.log('No authenticated user found');
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
        const orgSettings = data.value as unknown as OrganizationSettings;
        setSettings(orgSettings);
      } else {
        console.log('No organization settings found, using defaults');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to fetch organization settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  
  // Update organization settings
  const updateSettings = async (updatedSettings: Partial<OrganizationSettings>) => {
    setSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      const newSettings = {
        ...settings,
        ...updatedSettings
      };
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'organization_settings',
          value: newSettings as any,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving organization settings:', error);
        toast.error('Failed to save organization settings');
        return false;
      }
      
      setSettings(newSettings);
      toast.success('Organization settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating organization settings:', error);
      toast.error('An error occurred while saving settings');
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
    fetchSettings
  };
};

export default useOrganizationSettings;
