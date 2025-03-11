
import { useState, useEffect, useCallback } from 'react';

interface UseGoogleAutocompleteResult {
  initAutocomplete: (element: HTMLInputElement) => any;
  isLoaded: boolean;
  error: string | null;
}

export function useGoogleAutocomplete(): UseGoogleAutocompleteResult {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Google Maps API is loaded
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
    } else {
      setError("Google Maps API is not loaded");
    }
  }, []);

  // Initialize autocomplete on an input element
  const initAutocomplete = useCallback((inputElement: HTMLInputElement) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setError("Google Maps API is not loaded");
      return null;
    }

    try {
      const options = {
        componentRestrictions: { country: 'au' }, // Restrict to Australia
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      };

      // Create the autocomplete object
      return new window.google.maps.places.Autocomplete(inputElement, options);
    } catch (err) {
      setError(`Error initializing autocomplete: ${err}`);
      return null;
    }
  }, []);

  return { initAutocomplete, isLoaded, error };
}
