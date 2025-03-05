
import { useState, useEffect, createContext, useContext } from 'react';

interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
  showCompanyName: boolean;
}

interface HeaderSettingsContextType {
  settings: HeaderSettings;
  updateSettings: (newSettings: HeaderSettings) => void;
}

// Create context
const HeaderSettingsContext = createContext<HeaderSettingsContextType>({
  settings: {
    color: '#000000',
    height: 65,
    logoUrl: '/lovable-uploads/77021d72-0ef2-4178-8ddf-8a3c742c0974.png',
    showCompanyName: false
  },
  updateSettings: () => {}
});

// Default settings
const defaultSettings: HeaderSettings = {
  color: '#000000',
  height: 65,
  logoUrl: '/lovable-uploads/77021d72-0ef2-4178-8ddf-8a3c742c0974.png',
  showCompanyName: false
};

// Provider component
export const HeaderSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HeaderSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('headerSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('headerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: HeaderSettings) => {
    setSettings(newSettings);
  };

  return (
    <HeaderSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </HeaderSettingsContext.Provider>
  );
};

// Hook to use the settings
export const useHeaderSettings = () => {
  const context = useContext(HeaderSettingsContext);
  if (!context) {
    throw new Error('useHeaderSettings must be used within a HeaderSettingsProvider');
  }
  return context;
};
