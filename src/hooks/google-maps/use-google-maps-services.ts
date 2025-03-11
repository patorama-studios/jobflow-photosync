
import { useRef, useEffect } from 'react';

export const useGoogleMapsServices = () => {
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      if (!autocompleteServiceRef.current && window.google.maps.places.AutocompleteService) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      }
      
      if (!dummyDivRef.current) {
        const div = document.createElement('div');
        dummyDivRef.current = div;
      }
      
      if (!placesServiceRef.current && window.google.maps.places.PlacesService && dummyDivRef.current) {
        placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
      }
    } else {
      if (!document.getElementById('google-maps-script') && !window.google) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        script.onload = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            if (window.google.maps.places.AutocompleteService) {
              autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            }
            
            if (!dummyDivRef.current) {
              const div = document.createElement('div');
              dummyDivRef.current = div;
            }
            
            if (window.google.maps.places.PlacesService && dummyDivRef.current) {
              placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
            }
          }
        };
      }
    }
  }, []);

  return {
    autocompleteService: autocompleteServiceRef.current,
    placesService: placesServiceRef.current
  };
};
