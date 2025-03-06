import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
  showCompanyName: boolean;
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
  showCompanyName: false
};

const HeaderSettingsContext = createContext<HeaderSettingsContextType | undefined>(undefined);

export const HeaderSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
  const [title, setTitle] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonAction, setBackButtonAction] = useState<() => void>(() => () => {
    // Default no-op function that will be replaced
    console.log("Back button clicked, but no action set");
  });

  // Load settings from localStorage on first render
  useEffect(() => {
    const savedSettings = localStorage.getItem('headerSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved header settings:", error);
        // Keep default settings if there's an error
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('headerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<HeaderSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const onBackButtonClick = () => {
    backButtonAction();
  };

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
