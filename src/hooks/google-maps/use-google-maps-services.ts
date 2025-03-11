
import { useRef, useEffect, useState } from 'react';

export const useGoogleMapsServices = () => {
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        }
        
        if (!placesServiceRef.current && dummyDivRef.current) {
          placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
        }
        
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Check if the Google Maps API is already loaded
    if (initServices()) {
      return;
    }

    // Load the Google Maps API if it's not already loaded
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initServices();
      };
      
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (dummyDivRef.current) {
        document.body.removeChild(dummyDivRef.current);
      }
    };
  }, []);

  return {
    autocompleteService: autocompleteServiceRef.current,
    placesService: placesServiceRef.current,
    isLoaded
  };
};
