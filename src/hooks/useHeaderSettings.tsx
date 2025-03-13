
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HeaderSettings } from './types/user-settings-types';

interface HeaderSettingsContextType {
  settings: HeaderSettings;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  updateSettings: (newSettings: Partial<HeaderSettings>) => Promise<boolean>;
}

// Default header settings
const defaultSettings: HeaderSettings = {
  title: '',
  description: '',
  color: '#000000',
  height: 65,
  logoUrl: '',
  showCompanyName: false
};

const HeaderSettingsContext = createContext<HeaderSettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => false
});

export function HeaderSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [showBackButton, setShowBackButton] = useState<boolean | undefined>(undefined);
  const [onBackButtonClick, setOnBackButtonClick] = useState<(() => void) | undefined>(undefined);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        // If user is not logged in, use default settings
        if (!userData.user) {
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'header_settings')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching header settings:', error);
          return;
        }
        
        if (data && data.value) {
          setSettings({
            ...defaultSettings,
            ...data.value as object
          });
        }
      } catch (error) {
        console.error('Failed to fetch header settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const updateSettings = useCallback(async (newSettings: Partial<HeaderSettings>): Promise<boolean> => {
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
          key: 'header_settings',
          value: updatedSettings,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving header settings:', error);
        toast.error('Failed to save header settings');
        return false;
      }
      
      toast.success('Header settings saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to update header settings:', error);
      return false;
    }
  }, [settings]);

  // Method to update page title and description
  const updatePageInfo = useCallback((pageTitle?: string, pageDescription?: string, backButton?: boolean, backAction?: () => void) => {
    setTitle(pageTitle);
    setDescription(pageDescription);
    setShowBackButton(backButton);
    setOnBackButtonClick(backAction);
  }, []);
  
  return (
    <HeaderSettingsContext.Provider value={{ 
      settings, 
      title, 
      description, 
      showBackButton, 
      onBackButtonClick, 
      updateSettings 
    }}>
      {children}
    </HeaderSettingsContext.Provider>
  );
}

export const useHeaderSettings = () => useContext(HeaderSettingsContext);
