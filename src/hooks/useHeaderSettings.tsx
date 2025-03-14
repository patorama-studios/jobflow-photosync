
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
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        // If user is not logged in, use default settings
        if (!userData.user) {
          setIsLoaded(true);
          return;
        }
        
        console.log("Fetching header settings for user:", userData.user.id);
        
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
          console.log("Loaded header settings:", data.value);
          setSettings({
            ...defaultSettings,
            ...data.value as object
          });
        } else {
          // Save default settings if none exist
          console.log("No header settings found, using defaults");
          await updateSettingsInDB(defaultSettings, userData.user.id);
        }
      } catch (error) {
        console.error('Failed to fetch header settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchSettings();
  }, []);

  // Helper function to update settings in the database
  const updateSettingsInDB = async (updatedSettings: HeaderSettings, userId: string) => {
    try {
      console.log("Saving header settings to DB:", updatedSettings);
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'header_settings',
          value: updatedSettings,
          user_id: userId,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving header settings:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update header settings in DB:', error);
      return false;
    }
  };
  
  const updateSettings = useCallback(async (newSettings: Partial<HeaderSettings>): Promise<boolean> => {
    try {
      // Update local state
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      
      setSettings(updatedSettings);
      
      // Save to database if we have a user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.warn("Cannot save header settings: No user is logged in");
        toast.error("You must be logged in to save settings");
        return false;
      }
      
      // Save to Supabase
      const success = await updateSettingsInDB(updatedSettings, userData.user.id);
      
      if (!success) {
        toast.error('Failed to save header settings');
        return false;
      }
      
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
