
/**
 * Google Maps API integration utilities
 * Optimized for performance with better error handling and caching
 */

// Type definitions for Google Maps API
export namespace GoogleMapsTypes {
  export type Libraries = ('places' | 'drawing' | 'geometry' | 'visualization')[];
  
  export interface LoadScriptOptions {
    apiKey: string;
    libraries?: Libraries;
    region?: string;
    language?: string;
    version?: string;
  }
  
  export interface Autocomplete {
    addListener: (event: string, callback: () => void) => void;
    getPlace: () => Place;
  }
  
  export interface Place {
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
  }
}

// Cached promise for the Google Maps API to prevent duplicate loads
let googleMapsPromise: Promise<void> | null = null;

// Store region in localStorage for persistence
export function setDefaultRegion(region: string): void {
  try {
    localStorage.setItem('mapsDefaultRegion', region);
  } catch (e) {
    console.warn('Failed to save maps region preference:', e);
  }
}

export function getDefaultRegion(): string {
  try {
    return localStorage.getItem('mapsDefaultRegion') || 'au';
  } catch (e) {
    return 'au';
  }
}

/**
 * Load the Google Maps script with performance optimizations
 */
export function loadGoogleMapsScript(options: GoogleMapsTypes.LoadScriptOptions): Promise<void> {
  // Return cached promise if already loading or loaded
  if (googleMapsPromise) {
    return googleMapsPromise;
  }
  
  const {
    apiKey,
    libraries = ['places'],
    region = getDefaultRegion(),
    language = 'en',
    version = 'weekly'
  } = options;
  
  // Check if Google Maps is already loaded
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  
  // Create the loading promise
  googleMapsPromise = new Promise((resolve, reject) => {
    try {
      // Create a unique callback name
      const callbackName = `googleMapsCallback_${Math.round(Date.now() * Math.random())}`;
      
      // Define the callback
      (window as any)[callbackName] = () => {
        resolve();
        // Clean up the global callback
        delete (window as any)[callbackName];
      };
      
      // Create script with optimized loading attributes
      const script = document.createElement('script');
      const librariesParam = libraries.join(',');
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&region=${region}&language=${language}&v=${version}&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Add error handling
      script.onerror = (error) => {
        reject(new Error(`Google Maps script loading failed: ${error.type}`));
        // Reset the promise so it can be retried
        googleMapsPromise = null;
        // Clean up
        document.head.removeChild(script);
      };
      
      // Add the script to the DOM
      document.head.appendChild(script);
      
      // Add a timeout to avoid hanging
      setTimeout(() => {
        if (!(window.google && window.google.maps)) {
          reject(new Error('Google Maps script load timed out'));
          // Reset the promise so it can be retried
          googleMapsPromise = null;
        }
      }, 10000);
    } catch (error) {
      reject(error);
      // Reset the promise so it can be retried
      googleMapsPromise = null;
    }
  });
  
  return googleMapsPromise;
}

/**
 * Check if Google Maps script is already loaded
 */
export function isGoogleMapsLoaded(): boolean {
  return !!(window.google && window.google.maps);
}

/**
 * Get distance between two coordinates
 */
export function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Create a memoized geocoder to avoid redundant API calls
 */
export function createCachedGeocoder(): {
  geocode: (address: string) => Promise<{ lat: number; lng: number }>;
} {
  const cache: Record<string, { lat: number; lng: number }> = {};
  
  // Try to load cache from session storage
  try {
    const savedCache = sessionStorage.getItem('geocoderCache');
    if (savedCache) {
      Object.assign(cache, JSON.parse(savedCache));
    }
  } catch (e) {
    console.warn('Failed to load geocoder cache:', e);
  }
  
  // Save cache to session storage
  const saveCache = () => {
    try {
      sessionStorage.setItem('geocoderCache', JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to save geocoder cache:', e);
    }
  };
  
  // Handle window unload to save cache
  window.addEventListener('beforeunload', saveCache);
  
  return {
    geocode: async (address: string): Promise<{ lat: number; lng: number }> => {
      // Return from cache if available
      if (cache[address]) {
        return cache[address];
      }
      
      // Ensure Google Maps is loaded
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps not loaded');
      }
      
      // Create geocoder
      const geocoder = new window.google.maps.Geocoder();
      
      // Geocode the address
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            
            // Cache the result
            cache[address] = location;
            
            // Return the result
            resolve(location);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });
    }
  };
}

// Declare global window with Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        Geocoder: new () => {
          geocode: (
            request: { address: string },
            callback: (
              results: Array<{
                geometry: {
                  location: {
                    lat: () => number;
                    lng: () => number;
                  };
                };
              }>,
              status: string
            ) => void
          ) => void;
        };
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: object
          ) => GoogleMapsTypes.Autocomplete;
        };
      };
    };
  }
}
