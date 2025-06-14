
import React, { useRef, useEffect, useState } from 'react';
import { Input } from './input';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleAddressAutocompleteProps {
  onAddressSelect?: (place: any) => void;
  className?: string;
  placeholder?: string;
}

// Get Google Maps API key from localStorage or environment variable
const getGoogleMapsApiKey = () => {
  return localStorage.getItem('google_maps_api_key') || 
         process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 
         process.env.VITE_GOOGLE_MAPS_API_KEY;
};

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onAddressSelect,
  className,
  placeholder = "Search for an address..."
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Get the API key
    const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();
    
    // Skip Google Maps initialization if no API key is configured
    if (!GOOGLE_MAPS_API_KEY) {
      console.log('🔧 No Google Maps API key configured for autocomplete');
      setHasError(true);
      return;
    }

    // Set up global error handler for Google Maps
    window.gm_authFailure = () => {
      console.error('🔧 Google Maps API key error detected');
      setHasError(true);
      setIsLoading(false);
    };
    
    // Check if Google Maps is already loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setIsLoading(true);
      
      // Load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
        initializeAutocomplete();
      };
      script.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (onAddressSelect && place) {
          onAddressSelect(place);
        }
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      setHasError(true);
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {hasError ? (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        ) : (
          <MapPin className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      <Input
        ref={inputRef}
        className={cn("pl-10 pr-10", className)}
        placeholder={hasError ? "Enter address manually..." : placeholder}
      />
      
      {isLoading ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      ) : hasError ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      {hasError && (
        <p className="text-xs text-yellow-600 mt-1">
          📍 Address autocomplete unavailable - please enter address manually
        </p>
      )}
    </div>
  );
};
