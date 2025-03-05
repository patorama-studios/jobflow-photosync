
import { useState, useEffect, createContext, useContext } from 'react';

interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
}

interface HeaderSettingsContextType {
  settings: HeaderSettings;
  updateSettings: (newSettings: HeaderSettings) => void;
}

// Create context
const HeaderSettingsContext = createContext<HeaderSettingsContextType>({
  settings: {
    color: 'hsl(var(--background))',
    height: 56,
    logoUrl: ''
  },
  updateSettings: () => {}
});

// Default settings
const defaultSettings: HeaderSettings = {
  color: 'hsl(var(--background))',
  height: 56,
  logoUrl: ''
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
