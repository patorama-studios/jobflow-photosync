
export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  name?: string;
  address_components?: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Add missing type definitions for window.google
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (attrContainer: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: string;
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
        Map: new (
          mapDiv: HTMLElement,
          opts?: google.maps.MapOptions
        ) => google.maps.Map;
        Marker: new (opts?: google.maps.MarkerOptions) => google.maps.Marker;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
      };
    };
  }
}

// Define Google-specific types that are missing
declare namespace google.maps.places {
  interface PlaceResult {
    address_components?: AddressComponent[];
    formatted_address?: string;
    geometry?: {
      location?: google.maps.LatLng;
    };
    place_id?: string;
    name?: string;
    formatted_phone_number?: string;
    international_phone_number?: string;
    website?: string;
    url?: string;
    utc_offset_minutes?: number;
    vicinity?: string;
    html_attributions?: string[];
    utc_offset?: number;
    types?: string[];
    structured_formatting?: {
      main_text: string;
      secondary_text?: string;
    };
  }
  
  interface AutocompletePrediction {
    description: string;
    place_id: string;
    structured_formatting?: {
      main_text: string;
      secondary_text?: string;
    };
    terms: {
      offset: number;
      value: string;
    }[];
    types: string[];
    matched_substrings: {
      length: number;
      offset: number;
    }[];
  }
  
  interface Autocomplete {
    getPlace(): google.maps.places.PlaceResult;
    bindTo(bindKey: string, obj: Object, viewKey?: string, updateKey?: boolean): void;
    unbind(key: string): void;
    unbindAll(): void;
  }
  
  interface AutocompleteOptions {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    componentRestrictions?: { country: string | string[] };
    fields?: string[];
    placeIdOnly?: boolean;
    strictBounds?: boolean;
    types?: string[];
  }
}
