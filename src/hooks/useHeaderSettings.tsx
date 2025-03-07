
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

const HeaderSettingsContext = createContext<HeaderSettingsContextType | undefined>(undefined);

export const HeaderSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { value: persistedSettings, setValue: saveSettings, isLoading } = useAppSettings('headerSettings', defaultSettings);
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
  const [title, setTitle] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonAction, setBackButtonAction] = useState<() => void>(() => () => {
    console.log('Back button action not set');
  });

  // Load settings when persisted settings are available
  useEffect(() => {
    if (!isLoading) {
      setSettings(persistedSettings as HeaderSettings);
    }
  }, [persistedSettings, isLoading]);

  const updateSettings = useCallback((newSettings: Partial<HeaderSettings>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  }, [settings, saveSettings]);

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
    throw new Error('useHeaderSettings must be used within a HeaderSettingsProvider');
  }
  return context;
};
