
declare namespace google.maps {
  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: Element | Map);
      getDetails(
        request: PlaceDetailsRequest,
        callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
      ): void;
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
      };
      matched_substrings?: PredictionSubstring[];
      terms?: PredictionTerm[];
      types?: string[];
    }

    interface PredictionTerm {
      offset: number;
      value: string;
    }

    interface PredictionSubstring {
      length: number;
      offset: number;
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

    interface PlaceDetailsRequest {
      placeId: string;
      fields?: string[];
    }

    interface ComponentRestrictions {
      country: string | string[];
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: PlaceGeometry;
      name?: string;
      place_id?: string;
      types?: string[];
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

    const enum PlacesServiceStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      NOT_FOUND = 'NOT_FOUND'
    }

    const enum AutocompleteStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST'
    }
  }

  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    contains(latLng: LatLng): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): LatLng;
    toString(): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
  }

  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
}
