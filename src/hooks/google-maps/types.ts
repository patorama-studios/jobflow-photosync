
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
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (attrContainer: Element | HTMLDivElement) => google.maps.places.PlacesService;
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
            opts?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
        Map: any;
        Marker: any;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
        LatLngBounds: new (
          sw?: google.maps.LatLng | null, 
          ne?: google.maps.LatLng | null
        ) => google.maps.LatLngBounds;
      };
    };
  }
}
