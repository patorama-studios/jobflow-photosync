
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
  return 'au'; // Default to Australia
}

// Store the current region
let currentRegion = 'au';

// Set the default region
export function setDefaultRegion(region: string): void {
  currentRegion = region;
}

// Load the Google Maps script dynamically
export function loadGoogleMapsScript(options: { 
  apiKey: string;
  libraries?: string[];
  region?: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    
    try {
      // Create script element
      const script = document.createElement('script');
      const callbackName = `googleMapsCallback_${Date.now()}`;
      
      // Set callback for when script loads
      window[callbackName as keyof Window] = function() {
        delete window[callbackName as keyof Window];
        resolve();
      } as any; // Use type assertion to fix the TS error
      
      // Construct the URL with parameters
      const libraries = options.libraries ? options.libraries.join(',') : 'places';
      const region = options.region || currentRegion;
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=${libraries}&region=${region}&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        console.error('Google Maps script loading error:', error);
        reject(new Error('Failed to load Google Maps API'));
      };
      
      // Add to document
      document.head.appendChild(script);
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
