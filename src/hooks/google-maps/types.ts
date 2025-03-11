
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

// Define Google-specific types that are missing
export namespace google.maps {
  export interface LatLng {
    lat(): number;
    lng(): number;
    equals(other: LatLng): boolean;
    toString(): string;
    toUrlValue(precision?: number): string;
    toJSON(): {lat: number, lng: number};
  }
  
  export interface LatLngBounds {
    contains(latLng: LatLng): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): LatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
  }
  
  export interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }
  
  export namespace places {
    export interface PlaceResult {
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
    
    export interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
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
    
    export interface Autocomplete {
      getPlace(): PlaceResult;
      bindTo(bindKey: string, obj: Object, viewKey?: string, updateKey?: boolean): void;
      unbind(key: string): void;
      unbindAll(): void;
    }
    
    export interface AutocompleteOptions {
      bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
      componentRestrictions?: { country: string | string[] };
      fields?: string[];
      placeIdOnly?: boolean;
      strictBounds?: boolean;
      types?: string[];
    }
    
    export interface AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          componentRestrictions?: { country: string | string[] };
          types?: string[];
          bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
          sessionToken?: any;
        },
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: string
        ) => void
      ): void;
    }
    
    export interface PlacesService {
      getDetails(
        request: {
          placeId: string;
          fields?: string[];
          sessionToken?: any;
        },
        callback: (
          place: PlaceResult | null,
          status: string
        ) => void
      ): void;
    }
  }
}
