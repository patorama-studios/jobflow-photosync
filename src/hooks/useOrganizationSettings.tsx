
import { useState, useEffect, useCallback } from 'react';
import { OrganizationSettings } from './types/user-settings-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/MySQLAuthContext';
import { db } from '@/integrations/mysql/mock-client';

export const useOrganizationSettings = () => {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  
  // Fetch organization settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('🔧 Fetching organization settings from MySQL');
      
      // For now, provide default settings since we're using mock client
      // In a real implementation, this would query the MySQL database
      const defaultSettings: OrganizationSettings = {
        name: 'Photorama Studios',
        logo: '',
        address: '123 Studio Lane, Sydney NSW 2000',
        phone: '+61 2 9876 5432',
        email: 'hello@patorama.com.au',
        website: 'https://patorama.com.au',
        taxId: 'ABN 12 345 678 901',
        timezone: 'Australia/Sydney'
      };
      
      console.log('🔧 Loaded organization settings:', defaultSettings);
      setSettings(defaultSettings);
      
    } catch (error) {
      console.error('🔧 Failed to fetch organization settings:', error);
      toast.error('Failed to load organization settings');
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
      if (!user || !session) {
        toast.error('You must be logged in to save settings');
        return false;
      }
      
      console.log('🔧 Updating organization settings with:', updatedSettings);
      
      const newSettings = {
        ...(settings || {}),
        ...updatedSettings
      };
      
      console.log('🔧 New settings to save to MySQL:', newSettings);
      
      // Simulate saving to MySQL database
      // In a real implementation, this would call the MySQL database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSettings(newSettings as OrganizationSettings);
      console.log('🔧 Organization settings updated successfully');
      toast.success('Organization settings saved successfully');
      return true;
    } catch (error) {
      console.error('🔧 Error updating organization settings:', error);
      toast.error('Failed to save organization settings. Please try again.');
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
