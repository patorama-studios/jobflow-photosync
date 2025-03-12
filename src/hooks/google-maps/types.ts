
export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  name?: string;
  address_components?: AddressComponent[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface AddressDetails {
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  formatted_address?: string;
}

// Add missing type definitions for window.google
// Note: The global window.google declaration has been moved to this file
// to avoid conflicts with other declarations
declare global {
  interface Window {
    google: {
      maps: {
        places: {
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
          Autocomplete: new (
            inputField: HTMLInputElement,
            opts?: any
          ) => any;
        };
        Map: any;
        Marker: any;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
        LatLng: new (lat: number, lng: number) => any;
        LatLngBounds: new (
          sw?: any, 
          ne?: any
        ) => any;
      };
    };
  }
}
