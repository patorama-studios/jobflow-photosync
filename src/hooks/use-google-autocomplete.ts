
import { useState, useEffect, useCallback } from 'react';

interface UseGoogleAutocompleteOptions {
  apiKey?: string;
  componentRestrictions?: { country: string | string[] };
  types?: string[];
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
}

export function useGoogleAutocomplete(options: UseGoogleAutocompleteOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof google === 'undefined') {
      const script = document.createElement('script');
      const apiKey = options.apiKey || (window as any).GOOGLE_MAPS_API_KEY;
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps API');
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else if (typeof google !== 'undefined') {
      setIsLoaded(true);
    }
  }, [options.apiKey]);

  const initAutocomplete = useCallback((inputElement: HTMLInputElement) => {
    if (!isLoaded || !google || !google.maps || !google.maps.places) {
      return null;
    }

    try {
      const autocompleteOptions: google.maps.places.AutocompleteOptions = {};
      
      if (options.componentRestrictions) {
        autocompleteOptions.componentRestrictions = options.componentRestrictions;
      }
      
      if (options.types) {
        autocompleteOptions.types = options.types;
      }
      
      if (options.bounds) {
        autocompleteOptions.bounds = options.bounds;
      }
      
      const autocomplete = new google.maps.places.Autocomplete(inputElement, autocompleteOptions);
      
      // Focus the field when selecting
      autocomplete.addListener('place_changed', () => {
        inputElement.blur();
      });
      
      return autocomplete;
    } catch (err) {
      console.error('Error initializing Autocomplete:', err);
      setError('Failed to initialize Google Maps Autocomplete');
      return null;
    }
  }, [isLoaded, options]);

  return {
    isLoaded,
    error,
    initAutocomplete
  };
}
