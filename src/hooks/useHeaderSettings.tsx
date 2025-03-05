
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

  // Load settings from localStorage on first render
  useEffect(() => {
    const savedSettings = localStorage.getItem('headerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
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

  return (
    <HeaderSettingsContext.Provider value={{ settings, updateSettings }}>
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
