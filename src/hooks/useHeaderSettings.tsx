
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
  showCompanyName: boolean;
  title?: string | null;
  description?: string | null;
}

interface HeaderSettingsContextType {
  settings: HeaderSettings;
  updateSettings: (settings: Partial<HeaderSettings>) => Promise<boolean>;
  title: string | null;
  showBackButton: boolean;
  onBackButtonClick: () => void;
  setTitle: (title: string | null) => void;
  setShowBackButton: (show: boolean) => void;
  setBackButtonAction: (action: () => void) => void;
}

const defaultSettings: HeaderSettings = {
  color: '#ffffff',
  height: 65,
  logoUrl: '',
  showCompanyName: false,
  title: null,
  description: null
};

// Create the context with a meaningful default value that throws a helpful error
const HeaderSettingsContext = createContext<HeaderSettingsContextType | undefined>(undefined);

// Create a custom console error wrapper function for debugging
const logProviderError = () => {
  console.error(
    'HeaderSettingsProvider not found! Make sure HeaderSettingsProvider is mounted higher in the component tree.'
  );
};

export const HeaderSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
  const [title, setTitle] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonAction, setBackButtonAction] = useState<() => void>(() => () => {
    console.log('Back button action not set');
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Used to track if settings have been loaded and initialized
  const initialized = useRef(false);

  // Load settings from Supabase
  useEffect(() => {
    const fetchHeaderSettings = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching header settings from Supabase...');
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'headerSettings')
          .maybeSingle();

        if (error) {
          console.error('Error fetching header settings:', error);
          throw error;
        }

        if (data?.value) {
          console.log('Loaded header settings from Supabase:', data.value);
          // Safely cast the JSON value to HeaderSettings
          const loadedSettings = data.value as any;
          
          // Ensure all required properties exist with correct types
          const validatedSettings: HeaderSettings = {
            color: typeof loadedSettings.color === 'string' ? loadedSettings.color : defaultSettings.color,
            height: typeof loadedSettings.height === 'number' ? loadedSettings.height : defaultSettings.height,
            logoUrl: typeof loadedSettings.logoUrl === 'string' ? loadedSettings.logoUrl : defaultSettings.logoUrl,
            showCompanyName: typeof loadedSettings.showCompanyName === 'boolean' ? loadedSettings.showCompanyName : defaultSettings.showCompanyName,
            title: loadedSettings.title || null,
            description: loadedSettings.description || null
          };
          
          setSettings(validatedSettings);
        } else {
          console.log('No header settings found, using defaults');
          // Save default settings if none exist
          await saveToSupabase(defaultSettings);
          setSettings(defaultSettings);
        }
        
        initialized.current = true;
      } catch (error) {
        console.error('Error loading header settings:', error);
        toast.error('Failed to load header settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderSettings();
  }, []);

  // Function to save settings to Supabase
  const saveToSupabase = async (settingsToSave: HeaderSettings): Promise<boolean> => {
    try {
      console.log('Saving header settings to Supabase:', settingsToSave);
      
      // Convert HeaderSettings to a JSON object that can be stored in Supabase
      const jsonValue = {
        color: settingsToSave.color,
        height: settingsToSave.height,
        logoUrl: settingsToSave.logoUrl,
        showCompanyName: settingsToSave.showCompanyName,
        title: settingsToSave.title,
        description: settingsToSave.description
      };
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'headerSettings',
          value: jsonValue,
          is_global: true
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving header settings to Supabase:', error);
        toast.error('Failed to save header settings');
        throw error;
      }
      
      console.log('Header settings saved successfully to Supabase');
      return true;
    } catch (error) {
      console.error('Error saving header settings to Supabase:', error);
      toast.error('Failed to save header settings');
      return false;
    }
  };

  // Memoize updateSettings to prevent it from changing on every render
  const updateSettings = useCallback(async (newSettingsPartial: Partial<HeaderSettings>): Promise<boolean> => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettingsPartial
      };
      
      // Save to Supabase first
      const saveSuccess = await saveToSupabase(updatedSettings);
      
      if (saveSuccess) {
        // Only update local state if save was successful
        setSettings(updatedSettings);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }, [settings]);

  const onBackButtonClick = useCallback(() => {
    backButtonAction();
  }, [backButtonAction]);

  return (
    <HeaderSettingsContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        title, 
        showBackButton, 
        onBackButtonClick,
        setTitle,
        setShowBackButton,
        setBackButtonAction
      }}
    >
      {children}
    </HeaderSettingsContext.Provider>
  );
};

export const useHeaderSettings = () => {
  const context = useContext(HeaderSettingsContext);
  if (!context) {
    logProviderError();
    throw new Error('useHeaderSettings must be used within a HeaderSettingsProvider');
  }
  return context;
};

// Add a dummy provider for testing purposes
export const MockHeaderSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const mockUpdateSettings = async () => true;
  const mockOnClick = () => {};
  const mockSetAction = () => {};
  
  return (
    <HeaderSettingsContext.Provider
      value={{
        settings: {
          color: '#ffffff',
          height: 65,
          logoUrl: '',
          showCompanyName: false
        },
        updateSettings: mockUpdateSettings,
        title: null,
        showBackButton: false,
        onBackButtonClick: mockOnClick,
        setTitle: () => {},
        setShowBackButton: () => {},
        setBackButtonAction: mockSetAction
      }}
    >
      {children}
    </HeaderSettingsContext.Provider>
  );
};
