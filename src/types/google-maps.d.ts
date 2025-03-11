
declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: {
            input: string;
            componentRestrictions?: { country: string };
            types?: string[];
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
            fields: string[];
          },
          callback: (place: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting?: {
          main_text: string;
          secondary_text: string;
        };
      }

      type PlacesServiceStatus = 
        | 'OK'
        | 'ZERO_RESULTS'
        | 'OVER_QUERY_LIMIT'
        | 'REQUEST_DENIED'
        | 'INVALID_REQUEST'
        | 'UNKNOWN_ERROR';
    }
  }
}
