
import { useRef, useEffect, useState } from 'react';

export const useGoogleMapsServices = () => {
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create dummy div for PlacesService if it doesn't exist
    if (!dummyDivRef.current) {
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);
      dummyDivRef.current = div;
    }

    const initServices = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          }
          
          if (!placesServiceRef.current && dummyDivRef.current) {
            placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
          }
          
          setIsLoaded(true);
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error("Error initializing Google Maps services:", error);
          setIsLoading(false);
          return false;
        }
      }
      return false;
    };

    // Check if the Google Maps API is already loaded
    if (initServices()) {
      return;
    }

    // Load the Google Maps API if it's not already loaded and not currently loading
    if (!document.getElementById('google-maps-script') && !isLoading) {
      setIsLoading(true);
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initServices();
      };
      
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    }

    // Cleanup function with improved error handling for Node removal
    return () => {
      if (dummyDivRef.current) {
        try {
          // Check if element exists in document before removing
          if (document.body.contains(dummyDivRef.current)) {
            document.body.removeChild(dummyDivRef.current);
          }
          dummyDivRef.current = null;
        } catch (error) {
          console.error("Error removing dummy div:", error);
        }
      }
    };
  }, [isLoading]);

  return {
    autocompleteService: autocompleteServiceRef.current,
    placesService: placesServiceRef.current,
    isLoaded,
    isLoading
  };
};
