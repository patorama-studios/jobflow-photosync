
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadGoogleMapsScript } from '@/lib/google-maps';
import { toast } from '@/components/ui/use-toast';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  isLoading: true,
  error: null
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ apiKey, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
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
    
    loadGoogleMapsScript({ apiKey, libraries: ['places'] })
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
  }, [apiKey]);
  
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, isLoading, error }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
