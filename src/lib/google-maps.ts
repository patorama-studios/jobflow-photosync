
// Import any required types
import { PlaceResult } from '@/hooks/google-maps/types';

// Define interfaces for Google Maps types
interface GoogleMapsLatLng {
  lat: () => number;
  lng: () => number;
}

interface GoogleMapsPlaces {
  AutocompleteService: new () => any;
  PlacesService: new (attrContainer: Element | HTMLDivElement) => any;
  PlacesServiceStatus: {
    OK: string;
    ZERO_RESULTS: string;
    OVER_QUERY_LIMIT: string;
    REQUEST_DENIED: string;
    INVALID_REQUEST: string;
    UNKNOWN_ERROR: string;
  };
  Autocomplete: new (inputField: HTMLInputElement, opts?: any) => any;
}

export interface GoogleMapsTypes {
  places: GoogleMapsPlaces;
  Map: any;
  Marker: any;
  Animation: {
    DROP: number;
    BOUNCE: number;
  };
  LatLng: new (lat: number, lng: number) => GoogleMapsLatLng;
  LatLngBounds: new (sw?: any, ne?: any) => any;
}

// Store region preference
const defaultRegion = 'au'; // Default to Australia

export function setDefaultRegion(region: string): void {
  localStorage.setItem('maps_region', region);
}

export function getDefaultRegion(): string {
  return localStorage.getItem('maps_region') || defaultRegion;
}

// Function to load the Google Maps script
export function loadGoogleMapsScript(options: {
  apiKey: string;
  libraries?: string[];
  region?: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    const libraries = options.libraries?.join(',') || 'places';
    const region = options.region || getDefaultRegion();
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=${libraries}&region=${region}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error(`Google Maps script loading failed: ${e}`));
    
    document.head.appendChild(script);
  });
}

// Function with retry logic for loading Google Maps
export async function retryLoadGoogleMaps(options: {
  apiKey: string;
  libraries?: string[];
  region?: string;
  maxAttempts?: number;
}): Promise<void> {
  const maxAttempts = options.maxAttempts || 3;
  let attempts = 0;
  let lastError;

  while (attempts < maxAttempts) {
    try {
      await loadGoogleMapsScript(options);
      return; // Success, exit the function
    } catch (error) {
      attempts++;
      lastError = error;
      console.error(`Google Maps loading attempt ${attempts} failed:`, error);
      
      // Wait before retrying (exponential backoff)
      if (attempts < maxAttempts) {
        const delay = Math.pow(2, attempts) * 500; // 1s, 2s, 4s, etc.
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If we got here, all attempts failed
  throw lastError || new Error('Failed to load Google Maps after multiple attempts');
}

// Export functions for fetching place predictions and details
export async function getPlacePredictions(input: string): Promise<PlaceResult[]> {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'au' },
      },
      (predictions: any[], status: string) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          resolve([]);
          return;
        }

        const results = predictions.map((prediction) => ({
          place_id: prediction.place_id,
          formatted_address: prediction.description,
          name: prediction.structured_formatting?.main_text || prediction.description,
        }));

        resolve(results);
      }
    );
  });
}

export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }

    // Create a dummy div for the PlacesService
    const dummyDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(dummyDiv);

    service.getDetails(
      {
        placeId,
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      },
      (place: any, status: string) => {
        // Remove the dummy div
        dummyDiv.remove();

        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(null);
          return;
        }

        resolve(place);
      }
    );
  });
}

// The global declaration has been moved to types.ts to avoid conflict
