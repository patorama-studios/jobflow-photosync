
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
  updateSettings: (settings: Partial<HeaderSettings>) => void;
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
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'headerSettings')
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data?.value) {
          console.log('Loaded header settings from Supabase:', data.value);
          setSettings(data.value as HeaderSettings);
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
  const saveToSupabase = async (settingsToSave: HeaderSettings) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'headerSettings',
          value: settingsToSave,
          is_global: true
        });

      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving header settings to Supabase:', error);
      toast.error('Failed to save header settings');
      return false;
    }
  };

  // Memoize updateSettings to prevent it from changing on every render
  const updateSettings = useCallback(async (newSettingsPartial: Partial<HeaderSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettingsPartial
      };
      
      // Save to Supabase
      saveToSupabase(updatedSettings);
      
      return updatedSettings;
    });
  }, []);

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
  const mockUpdateSettings = () => {};
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
