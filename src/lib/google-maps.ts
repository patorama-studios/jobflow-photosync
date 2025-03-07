
// This file provides Google Maps utilities and type definitions
export interface GoogleMapsTypes {
  Geocoder: new () => {
    geocode: (
      request: { address: string },
      callback: (
        results: { geometry: { location: { lat: () => number; lng: () => number } } }[],
        status: string
      ) => void
    ) => void;
  };
  places: {
    Autocomplete: new (
      input: HTMLInputElement,
      options?: object
    ) => Autocomplete;
  };
  event: {
    clearInstanceListeners: (instance: any) => void;
  };
}

export interface Autocomplete {
  addListener: (event: string, callback: () => void) => { remove: () => void };
  getPlace: () => {
    address_components?: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address?: string;
    geometry?: {
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
}

// Helper to get preferred region
export function getDefaultRegion(): string {
  return localStorage.getItem('google_maps_region') || 'au'; // Default to Australia
}

// Store the current region
let currentRegion = getDefaultRegion();

// Set the default region
export function setDefaultRegion(region: string): void {
  currentRegion = region;
  localStorage.setItem('google_maps_region', region);
}

// Check if Google Maps script is already loaded
export function isGoogleMapsLoaded(): boolean {
  return !!window.google && !!window.google.maps && !!window.google.maps.places;
}

// Load the Google Maps script dynamically
export function loadGoogleMapsScript(options: { 
  apiKey: string;
  libraries?: string[];
  region?: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isGoogleMapsLoaded()) {
      console.log("Google Maps already loaded, resolving promise");
      resolve();
      return;
    }
    
    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
      console.log("Google Maps script is already being loaded, waiting...");
      // Wait for it to load
      const checkGoogleMaps = setInterval(() => {
        if (isGoogleMapsLoaded()) {
          clearInterval(checkGoogleMaps);
          console.log("Google Maps finished loading while waiting");
          resolve();
        }
      }, 100);
      
      // Set a timeout to prevent infinite waiting
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        console.error("Google Maps loading timed out after waiting");
        reject(new Error('Google Maps loading timed out'));
      }, 10000);
      
      return;
    }
    
    try {
      console.log("Starting to load Google Maps script...");
      // Create script element
      const script = document.createElement('script');
      const callbackName = `googleMapsCallback_${Date.now()}`;
      
      // Set callback for when script loads
      window[callbackName as keyof Window] = function() {
        console.log("Google Maps callback triggered");
        delete window[callbackName as keyof Window];
        resolve();
      } as unknown as never; // Fixed: Use unknown as an intermediate step to never
      
      // Construct the URL with parameters
      const libraries = options.libraries ? options.libraries.join(',') : 'places';
      const region = options.region || currentRegion;
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=${libraries}&region=${region}&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Add error handling
      script.onerror = (error) => {
        console.error('Google Maps script loading error:', error);
        reject(new Error('Failed to load Google Maps API'));
      };
      
      // Add to document
      document.head.appendChild(script);
      console.log(`Google Maps script added to document (region: ${region}, libraries: ${libraries})`);
    } catch (error) {
      console.error('Error setting up Google Maps script:', error);
      reject(error);
    }
  });
}

// Add window augmentation to include google maps
declare global {
  interface Window {
    google?: {
      maps: GoogleMapsTypes & {
        event: {
          clearInstanceListeners: (instance: any) => void;
        }
      };
      [key: string]: any; // For the callback function
    };
  }
}
