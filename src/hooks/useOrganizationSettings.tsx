
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrganizationSettings } from './types/user-settings-types';
import { toast } from 'sonner';

export const useOrganizationSettings = () => {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch organization settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the first organization settings record (should only be one for the company)
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" - not an error for us
        console.error('Error fetching organization settings:', error);
        toast.error('Failed to load organization settings');
        return;
      }
      
      if (data) {
        setSettings(data.settings as OrganizationSettings);
      } else {
        // Create default settings if none exist
        const newSettings: OrganizationSettings = {
          name: '',
          logo: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          taxId: '',
          timezone: 'America/New_York'
        };
        
        const { error: createError } = await supabase
          .from('organization_settings')
          .insert({
            settings: newSettings,
            updated_by: (await supabase.auth.getUser()).data.user?.id
          });
        
        if (createError) {
          console.error('Error creating default organization settings:', createError);
        } else {
          setSettings(newSettings);
        }
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
    try {
      // Get current user for the updated_by field
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      // Check user role - only admins can update org settings
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single();
        
      if (!profileData || profileData.role !== 'admin') {
        toast.error('Only admins can update organization settings');
        return false;
      }
      
      // Get existing settings to update
      const { data, error: fetchError } = await supabase
        .from('organization_settings')
        .select('id, settings')
        .limit(1)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching current organization settings:', fetchError);
        toast.error('Failed to update organization settings');
        return false;
      }
      
      const newSettings = {
        ...(settings || {}),
        ...updatedSettings
      };
      
      if (data?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('organization_settings')
          .update({
            settings: newSettings,
            updated_by: userData.user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
        
        if (error) {
          console.error('Error updating organization settings:', error);
          toast.error('Failed to save organization settings');
          return false;
        }
      } else {
        // Create new settings
        const { error } = await supabase
          .from('organization_settings')
          .insert({
            settings: newSettings,
            updated_by: userData.user.id
          });
        
        if (error) {
          console.error('Error creating organization settings:', error);
          toast.error('Failed to save organization settings');
          return false;
        }
      }
      
      setSettings(newSettings as OrganizationSettings);
      toast.success('Organization settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating organization settings:', error);
      toast.error('An error occurred while saving settings');
      return false;
    }
  };
  
  return {
    settings,
    loading,
    updateSettings,
    fetchSettings
  };
};
