
// Type definitions for Google Maps JavaScript API 3.51
// This is a partial definition file focused on the Places API

declare namespace google.maps {
  // Places namespace
  namespace places {
    class AutocompleteService {
      constructor();
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: Element | google.maps.Map);
      getDetails(
        request: PlaceDetailsRequest,
        callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
      ): void;
    }

    interface AutocompletionRequest {
      input: string;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: ComponentRestrictions;
      location?: LatLng;
      offset?: number;
      radius?: number;
      types?: string[];
    }

    interface ComponentRestrictions {
      country: string | string[];
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      reference: string;
      structured_formatting: {
        main_text: string;
        main_text_matched_substrings: PredictionSubstring[];
        secondary_text: string;
        secondary_text_matched_substrings?: PredictionSubstring[];
      };
      terms: PredictionTerm[];
      types: string[];
      matched_substrings: PredictionSubstring[];
    }

    interface PredictionTerm {
      offset: number;
      value: string;
    }

    interface PredictionSubstring {
      length: number;
      offset: number;
    }

    interface PlaceDetailsRequest {
      placeId?: string;
      place_id?: string;
      fields?: string[];
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      adr_address?: string;
      formatted_address?: string;
      formatted_phone_number?: string;
      geometry?: PlaceGeometry;
      html_attributions?: string[];
      icon?: string;
      international_phone_number?: string;
      name?: string;
      place_id?: string;
      plus_code?: { compound_code: string; global_code: string };
      price_level?: number;
      rating?: number;
      types?: string[];
      url?: string;
      user_ratings_total?: number;
      utc_offset_minutes?: number;
      vicinity?: string;
      website?: string;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface PlaceGeometry {
      location: LatLng;
      viewport: LatLngBounds;
    }

    enum PlacesServiceStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      NOT_FOUND = 'NOT_FOUND'
    }
  }

  // Basic Google Maps types needed for Places API
  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    lat(): number;
    lng(): number;
    equals(other: LatLng): boolean;
    toString(): string;
    toUrlValue(precision?: number): string;
  }

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    contains(latLng: LatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toSpan(): LatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }
}
