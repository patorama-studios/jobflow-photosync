
declare namespace google.maps {
  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          componentRestrictions?: { country: string | string[] };
          types?: string[];
          bounds?: LatLngBounds | LatLngBoundsLiteral;
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

    class Autocomplete {
      constructor(
        inputField: HTMLInputElement,
        options?: {
          types?: string[];
          componentRestrictions?: { country: string | string[] };
          fields?: string[];
          bounds?: LatLngBounds | LatLngBoundsLiteral;
        }
      );
      
      addListener(eventName: string, handler: Function): MapsEventListener;
      getPlace(): PlaceResult;
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: {
        location?: LatLng;
        viewport?: LatLngBounds;
      };
      place_id?: string;
      types?: string[];
      name?: string;
      website?: string;
      photos?: PlacePhoto[];
    }

    interface AddressComponent {
      short_name: string;
      long_name: string;
      types: string[];
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting?: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings?: {
          offset: number;
          length: number;
        }[];
      };
      matched_substrings?: {
        offset: number;
        length: number;
      }[];
      terms?: {
        offset: number;
        value: string;
      }[];
      types?: string[];
    }

    interface PlacePhoto {
      getUrl(options: { maxWidth: number; maxHeight: number }): string;
      height: number;
      width: number;
      html_attributions: string[];
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

  interface MapsEventListener {
    remove(): void;
  }

  namespace event {
    function clearInstanceListeners(instance: Object): void;
    function addListener(instance: Object, eventName: string, handler: Function): MapsEventListener;
    function removeListener(listener: MapsEventListener): void;
  }
}
