
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadGoogleMapsScript, setDefaultRegion, getDefaultRegion } from '@/lib/google-maps';
import { toast } from '@/components/ui/use-toast';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  setRegion: (region: string) => void;
  currentRegion: string;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  isLoading: true,
  error: null,
  setRegion: () => {},
  currentRegion: 'au'
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
  const [currentRegion, setCurrentRegion] = useState(defaultRegion);
  
  const setRegion = (region: string) => {
    setCurrentRegion(region);
    setDefaultRegion(region);
  };
  
  useEffect(() => {
    // Set default region
    setDefaultRegion(currentRegion);
    
    if (!apiKey) {
      setError(new Error('Google Maps API key is missing'));
      setIsLoading(false);
      toast({
        title: "API Key Missing",
        description: "Google Maps API key is required for address features.",
        variant: "destructive"
      });
      return;
    }
    
    loadGoogleMapsScript({ apiKey, libraries: ['places'], region: currentRegion })
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        toast({
          title: "Google Maps Error",
          description: "Failed to load Google Maps. Address features may not work properly.",
          variant: "destructive"
        });
        console.error('Google Maps loading error:', err);
      });
  }, [apiKey, currentRegion]);
  
  return (
    <GoogleMapsContext.Provider value={{ 
      isLoaded, 
      isLoading, 
      error, 
      setRegion,
      currentRegion
    }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
