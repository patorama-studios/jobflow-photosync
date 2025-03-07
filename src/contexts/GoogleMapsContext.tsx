
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadGoogleMapsScript, setDefaultRegion, getDefaultRegion } from '@/lib/google-maps';
import { toast } from 'sonner';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  setRegion: (region: string) => void;
  currentRegion: string;
  retryLoading: () => void;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  isLoading: true,
  error: null,
  setRegion: () => {},
  currentRegion: 'au',
  retryLoading: () => {}
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  apiKey: string;
  children: React.ReactNode;
  defaultRegion?: string;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ 
  apiKey, 
  children,
  defaultRegion = 'au' // Default to Australia
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentRegion, setCurrentRegion] = useState(defaultRegion || getDefaultRegion());
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  const setRegion = (region: string) => {
    setCurrentRegion(region);
    setDefaultRegion(region);
    console.log(`Region changed to: ${region}`);
  };
  
  const loadMapsApi = async () => {
    setIsLoading(true);
    setError(null);
    
    // First check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log("Google Maps already loaded, initializing context");
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }
    
    if (!apiKey) {
      const err = new Error('Google Maps API key is missing');
      console.error(err);
      setError(err);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log(`Loading Google Maps API (attempt ${loadAttempts + 1})...`);
      await loadGoogleMapsScript({ 
        apiKey, 
        libraries: ['places'], 
        region: currentRegion 
      });
      console.log("Google Maps API loaded successfully");
      setIsLoaded(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error(`Google Maps loading error (attempt ${loadAttempts + 1}):`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      
      // Show a toast notification about the failure
      toast.error("Failed to load Google Maps. Address search may not work correctly.");
    }
  };
  
  const retryLoading = () => {
    setLoadAttempts(prevAttempts => prevAttempts + 1);
    loadMapsApi();
  };
  
  useEffect(() => {
    // Set default region on mount
    setDefaultRegion(currentRegion);
    
    // Load the API
    loadMapsApi();
    
    // Cleanup function
    return () => {
      // Any cleanup needed when the provider unmounts
    };
  }, [apiKey, currentRegion]); // Re-run when API key or region changes
  
  return (
    <GoogleMapsContext.Provider value={{ 
      isLoaded, 
      isLoading, 
      error, 
      setRegion,
      currentRegion,
      retryLoading
    }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
