
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HeaderSettings } from "./types/user-settings-types";

// Default header settings
const DEFAULT_HEADER_SETTINGS: HeaderSettings = {
  color: "#000000",
  height: 64,
  logoUrl: "",
  showCompanyName: true,
  title: "",
  description: ""
};

// Create context
type HeaderSettingsContextType = {
  settings: HeaderSettings;
  updateSettings: (newSettings: Partial<HeaderSettings>) => Promise<boolean>;
  loading: boolean;
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  setTitle?: (title: string | undefined) => void;
  setShowBackButton?: (show: boolean) => void;
  setOnBackButtonClick?: (callback: (() => void) | undefined) => void;
};

const HeaderSettingsContext = createContext<HeaderSettingsContextType>({
  settings: DEFAULT_HEADER_SETTINGS,
  updateSettings: async () => false,
  loading: true,
});

// Create provider component
export const HeaderSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<HeaderSettings>(DEFAULT_HEADER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [onBackButtonClick, setOnBackButtonClick] = useState<(() => void) | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch header settings from database
  useEffect(() => {
    async function fetchHeaderSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'header_settings')
          .maybeSingle();

        if (error) {
          console.error('Error fetching header settings:', error);
          return;
        }

        if (data?.value) {
          // Properly cast the JSON value to the expected type
          const settingsData = data.value as unknown as HeaderSettings;
          setSettings({
            ...DEFAULT_HEADER_SETTINGS,
            ...settingsData
          });
        }
      } catch (error) {
        console.error('Unexpected error loading header settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeaderSettings();
  }, []);

  // Update header settings
  const updateSettingsInDb = async (newSettings: Partial<HeaderSettings>): Promise<boolean> => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };
      setSettings(updatedSettings);

      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('Settings updated in local state only (user not authenticated)');
        return true; // Return true even when not authenticated so UI updates work
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Cannot save header settings: No user is logged in');
        return false;
      }

      // Check if we have an existing record
      const { data: existingData } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'header_settings')
        .maybeSingle();

      // Convert HeaderSettings to a plain JSON-serializable object
      const settingsValue = JSON.parse(JSON.stringify(updatedSettings));

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('app_settings')
          .update({ 
            value: settingsValue,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'header_settings');
      } else {
        // Insert new record
        result = await supabase
          .from('app_settings')
          .insert({
            key: 'header_settings',
            value: settingsValue,
            user_id: user.id,
            is_global: true
          });
      }

      if (result.error) {
        console.error('Error saving header settings:', result.error);
        toast.error('Failed to save header settings');
        return false;
      }

      toast.success('Header settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error updating header settings:', error);
      toast.error('Failed to save header settings');
      return false;
    }
  };

  // Create a debounced version of updateSettingsInDb that returns a Promise<boolean>
  const createDebouncedUpdate = () => {
    let handler: ReturnType<typeof setTimeout>;
    return (newSettings: Partial<HeaderSettings>): Promise<boolean> => {
      return new Promise((resolve) => {
        clearTimeout(handler);
        handler = setTimeout(async () => {
          const result = await updateSettingsInDb(newSettings);
          resolve(result);
        }, 500);
      });
    };
  };

  // Create the debounced function
  const debouncedUpdateSettings = useCallback(createDebouncedUpdate(), [settings, isAuthenticated]);

  // Provide a wrapper function that updates state immediately but debounces the DB write
  const updateSettings = async (newSettings: Partial<HeaderSettings>): Promise<boolean> => {
    // Update local state immediately for a responsive UI
    setSettings(current => ({
      ...current,
      ...newSettings
    }));
    
    // Use the debounced function that returns a Promise<boolean>
    return await debouncedUpdateSettings(newSettings);
  };

  return (
    <HeaderSettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      loading,
      title,
      showBackButton,
      onBackButtonClick,
      setTitle,
      setShowBackButton,
      setOnBackButtonClick
    }}>
      {children}
    </HeaderSettingsContext.Provider>
  );
};

// Custom hook to use the header settings context
export const useHeaderSettings = () => useContext(HeaderSettingsContext);
