
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAppSettings } from './useAppSettings';

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
  const { value: persistedSettings, setValue: saveSettings, isLoading } = useAppSettings('headerSettings', defaultSettings);
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
  const [title, setTitle] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonAction, setBackButtonAction] = useState<() => void>(() => () => {
    console.log('Back button action not set');
  });

  // Load settings when persisted settings are available and only once
  useEffect(() => {
    if (!isLoading && persistedSettings) {
      setSettings(previousSettings => {
        // Only update if different to prevent infinite loops
        if (JSON.stringify(previousSettings) !== JSON.stringify(persistedSettings)) {
          return persistedSettings as HeaderSettings;
        }
        return previousSettings;
      });
    }
  }, [persistedSettings, isLoading]);

  // Memoize updateSettings to prevent it from changing on every render
  const updateSettings = useCallback((newSettings: Partial<HeaderSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings
      };
      
      // Only save if there are actual changes to prevent loops
      if (JSON.stringify(updatedSettings) !== JSON.stringify(prevSettings)) {
        saveSettings(updatedSettings);
        return updatedSettings;
      }
      return prevSettings;
    });
  }, [saveSettings]);

  const onBackButtonClick = useCallback(() => {
    backButtonAction();
  }, [backButtonAction]);

  // Log when provider is mounted for debugging
  useEffect(() => {
    console.log('HeaderSettingsProvider mounted');
    return () => {
      console.log('HeaderSettingsProvider unmounted');
    };
  }, []);

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
        settings: defaultSettings,
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
