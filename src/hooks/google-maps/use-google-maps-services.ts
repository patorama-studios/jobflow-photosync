
import { useRef, useEffect, useState } from 'react';

export const useGoogleMapsServices = () => {
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const apiCheckIntervalRef = useRef<any>(null);

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
          console.log('Initializing Google Maps services');
          
          if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            console.log('AutocompleteService initialized');
          }
          
          if (!placesServiceRef.current && dummyDivRef.current) {
            placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
            console.log('PlacesService initialized');
          }
          
          setIsLoaded(true);
          setIsLoading(false);
          setHasErrored(false);
          
          // Clear any existing check interval
          if (apiCheckIntervalRef.current) {
            clearInterval(apiCheckIntervalRef.current);
            apiCheckIntervalRef.current = null;
          }
          
          return true;
        } catch (error) {
          console.error("Error initializing Google Maps services:", error);
          setIsLoading(false);
          setHasErrored(true);
          return false;
        }
      }
      return false;
    };

    // Check if the Google Maps API is already loaded
    if (initServices()) {
      return;
    }

    // Don't try to load more than 3 times
    if (loadAttempts >= 3) {
      console.warn("Maximum Google Maps loading attempts reached");
      setIsLoading(false);
      setHasErrored(true);
      return;
    }

    // Load the Google Maps API if it's not already loaded and not currently loading
    if (!document.getElementById('google-maps-script') && !isLoading) {
      setIsLoading(true);
      setLoadAttempts(prev => prev + 1);
      console.log(`Loading Google Maps API (attempt ${loadAttempts + 1})`);

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Add timeout to prevent indefinite loading
      const timeoutId = setTimeout(() => {
        if (!window.google?.maps?.places) {
          console.error("Google Maps loading timed out");
          setIsLoading(false);
          setHasErrored(true);
          
          // Remove the script tag to try again
          const existingScript = document.getElementById('google-maps-script');
          if (existingScript) {
            existingScript.remove();
          }
        }
      }, 8000);
      
      script.onload = () => {
        clearTimeout(timeoutId);
        console.log('Google Maps API loaded successfully');
        
        // Give a moment for the Places library to initialize
        setTimeout(() => {
          if (initServices()) {
            console.log('Services initialized after script load');
          } else {
            console.warn('Places library not available immediately after load, setting up interval check');
            
            // Set up an interval to check when the Places service becomes available
            if (!apiCheckIntervalRef.current) {
              apiCheckIntervalRef.current = setInterval(() => {
                if (window.google?.maps?.places) {
                  console.log('Places library now available, initializing services');
                  initServices();
                  clearInterval(apiCheckIntervalRef.current);
                  apiCheckIntervalRef.current = null;
                }
              }, 500);
              
              // Set a timeout to eventually clear the interval
              setTimeout(() => {
                if (apiCheckIntervalRef.current) {
                  clearInterval(apiCheckIntervalRef.current);
                  apiCheckIntervalRef.current = null;
                  console.warn('Gave up waiting for Places library');
                  setHasErrored(true);
                }
              }, 10000);
            }
          }
        }, 100);
      };
      
      script.onerror = () => {
        clearTimeout(timeoutId);
        console.error("Failed to load Google Maps API");
        setIsLoading(false);
        setHasErrored(true);
        
        // Remove the script tag
        script.remove();
      };
      
      document.head.appendChild(script);
    }

    // Cleanup function with improved error handling for Node removal
    return () => {
      if (apiCheckIntervalRef.current) {
        clearInterval(apiCheckIntervalRef.current);
        apiCheckIntervalRef.current = null;
      }
      
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
  }, [isLoading, loadAttempts]);

  return {
    autocompleteService: autocompleteServiceRef.current,
    placesService: placesServiceRef.current,
    isLoaded,
    isLoading,
    hasErrored
  };
};
