
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

interface GoogleMapsTypes {
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

// Update window interface declaration to fix the conflict
declare global {
  interface Window {
    google: {
      maps: GoogleMapsTypes;
    };
  }
}
