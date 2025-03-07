
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadGoogleMapsScript, setDefaultRegion, getDefaultRegion } from '@/lib/google-maps';
import { toast } from 'sonner';

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
      const err = new Error('Google Maps API key is missing');
      setError(err);
      setIsLoading(false);
      console.error(err);
      return;
    }
    
    // First check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      setIsLoading(false);
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
