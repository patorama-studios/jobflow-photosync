
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useIntegrationSettings = (integrationType: string, isCompanyWide: boolean = true) => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setError('User not authenticated');
        return;
      }
      
      let query = supabase
        .from('integration_settings')
        .select('*')
        .eq('integration_type', integrationType);
      
      if (isCompanyWide) {
        query = query.eq('is_company_wide', true);
      } else {
        query = query.eq('user_id', userData.user.id).eq('is_company_wide', false);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error(`Error fetching ${integrationType} settings:`, error);
        setError(error.message);
        return;
      }
      
      if (data) {
        setSettings(data.settings);
      } else {
        // Create default empty settings object
        setSettings({});
      }
    } catch (error: any) {
      console.error(`Error in fetchSettings for ${integrationType}:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [integrationType, isCompanyWide]);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  
  const saveSettings = useCallback(async (newSettings: any) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      // For company-wide settings, check if user is admin
      if (isCompanyWide) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userData.user.id)
          .single();
          
        if (!profileData || profileData.role !== 'admin') {
          toast.error('Only admins can update company-wide integration settings');
          return false;
        }
      }
      
      // Check if settings already exist
      const { data, error: fetchError } = await supabase
        .from('integration_settings')
        .select('id')
        .eq('integration_type', integrationType)
        .eq('is_company_wide', isCompanyWide);
      
      if (fetchError) {
        console.error(`Error checking existing ${integrationType} settings:`, fetchError);
        toast.error('Failed to save integration settings');
        return false;
      }
      
      let result;
      
      if (data && data.length > 0) {
        // Update existing settings
        result = await supabase
          .from('integration_settings')
          .update({
            settings: newSettings,
            updated_at: new Date().toISOString()
          })
          .eq('id', data[0].id);
      } else {
        // Create new settings
        result = await supabase
          .from('integration_settings')
          .insert({
            integration_type: integrationType,
            settings: newSettings,
            is_company_wide: isCompanyWide,
            user_id: !isCompanyWide ? userData.user.id : null
          });
      }
      
      if (result.error) {
        console.error(`Error saving ${integrationType} settings:`, result.error);
        toast.error('Failed to save integration settings');
        return false;
      }
      
      setSettings(newSettings);
      toast.success('Integration settings saved successfully');
      return true;
    } catch (error: any) {
      console.error(`Error saving ${integrationType} settings:`, error);
      toast.error(error.message || 'An unexpected error occurred');
      return false;
    }
  }, [integrationType, isCompanyWide]);
  
  return {
    settings,
    loading,
    error,
    saveSettings,
    fetchSettings
  };
};
