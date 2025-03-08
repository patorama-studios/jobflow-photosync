
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrganizationSettings {
  companyName: string;
  website: string;
  supportEmail: string; 
  companyPhone: string;
  companyTimezone: string;
  companyAddress: string;
  addressFormat: string;
}

export function useOrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>({
    companyName: 'Acme Photography',
    website: 'https://acmephotography.com',
    supportEmail: 'support@acmephotography.com',
    companyPhone: '+1 (555) 987-6543',
    companyTimezone: 'America/New_York',
    companyAddress: '123 Main Street, Suite 200\nSan Francisco, CA 94105',
    addressFormat: 'Two-line format: {street}\n{city}, {state} {postal_code}'
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load settings from Supabase on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'organization')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          throw error;
        }

        if (data) {
          setSettings(data.value as OrganizationSettings);
        }
      } catch (error) {
        console.error('Error fetching organization settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings to Supabase
  const saveSettings = async (newSettings: OrganizationSettings) => {
    try {
      setLoading(true);

      // Check if setting exists
      const { data: existingData } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'organization')
        .single();

      if (existingData) {
        // Update existing setting
        const { error } = await supabase
          .from('app_settings')
          .update({ 
            value: newSettings,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'organization');

        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('app_settings')
          .insert({ 
            key: 'organization',
            value: newSettings,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            is_global: true
          });

        if (error) throw error;
      }

      setSettings(newSettings);
      
      toast({
        title: "Settings saved",
        description: "Organization settings have been updated",
      });
    } catch (error) {
      console.error('Error saving organization settings:', error);
      
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your organization settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    saveSettings
  };
}
