
// Google Maps Types
declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    extend(point: LatLng): LatLngBounds;
  }

  type LatLngBoundsLiteral = {
    east: number;
    north: number;
    south: number;
    west: number;
  };

  interface GeocoderResponse {
    results: GeocoderResult[];
    status: GeocoderStatus;
  }

  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
    formatted_address: string;
    geometry: {
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
    };
    place_id: string;
    types: string[];
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  enum GeocoderStatus {
    OK = "OK",
    ZERO_RESULTS = "ZERO_RESULTS",
    OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
    REQUEST_DENIED = "REQUEST_DENIED",
    INVALID_REQUEST = "INVALID_REQUEST",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
  }

  enum GeocoderLocationType {
    APPROXIMATE = "APPROXIMATE",
    GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
    RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
    ROOFTOP = "ROOFTOP"
  }

  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          componentRestrictions?: { country: string | string[] };
          types?: string[];
          bounds?: LatLngBounds;
        },
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: HTMLDivElement | HTMLMapElement);
      getDetails(
        request: {
          placeId: string;
          fields?: string[];
        },
        callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
      ): void;
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting?: {
        main_text: string;
        secondary_text: string;
      };
      types: string[];
      matched_substrings: Array<{
        length: number;
        offset: number;
      }>;
    }

    interface PlaceResult {
      address_components?: GeocoderAddressComponent[];
      formatted_address?: string;
      geometry?: {
        location: LatLng;
        viewport: LatLngBounds;
      };
      name?: string;
      place_id: string;
      types?: string[];
    }

    enum PlacesServiceStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
      NOT_FOUND = "NOT_FOUND"
    }
  }
}
