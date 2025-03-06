
// This file needs to be created or modified to fix TS errors
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

// Add window augmentation to include google maps
declare global {
  interface Window {
    google?: {
      maps: GoogleMapsTypes & {
        event: {
          clearInstanceListeners: (instance: any) => void;
        }
      };
    };
  }
}
