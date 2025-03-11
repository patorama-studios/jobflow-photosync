import { useEffect, useState, useRef } from 'react';

interface UseGoogleAutocompleteProps {
  apiKey?: string;
  options?: {
    types?: string[];
    componentRestrictions?: { country: string | string[] };
  };
}

interface GoogleAutocompleteResult {
  isLoaded: boolean;
  error: string;
  initAutocomplete: (inputElement: HTMLInputElement) => google.maps.places.Autocomplete;
}

export const useGoogleAutocomplete = ({
  apiKey,
  options = {},
}: UseGoogleAutocompleteProps = {}): GoogleAutocompleteResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Otherwise load the API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      setIsLoaded(true);
    });

    script.addEventListener('error', () => {
      setError('Failed to load Google Maps API');
    });

    document.head.appendChild(script);

    return () => {
      // Clean up script
      document.head.removeChild(script);
    };
  }, [apiKey]);

  const initAutocomplete = (inputElement: HTMLInputElement): google.maps.places.Autocomplete => {
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      throw new Error('Google Maps API not loaded');
    }

    if (autocompleteRef.current) {
      return autocompleteRef.current;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      ...options,
    });

    autocompleteRef.current = autocomplete;
    return autocomplete;
  };

  return {
    isLoaded,
    error,
    initAutocomplete,
  };
};
