
declare namespace google.maps.places {
  interface AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
    ): void;
  }

  interface PlaceResult {
    place_id?: string;
    formatted_address?: string;
    name?: string;
    address_components?: GeocoderAddressComponent[];
    geometry?: {
      location: LatLng;
      viewport?: LatLngBounds;
    };
    types?: string[];
    rating?: number;
    photos?: PlacePhoto[];
    icon?: string;
    icon_background_color?: string;
    icon_mask_base_uri?: string;
    url?: string;
    website?: string;
    vicinity?: string;
    html_attributions?: string[];
    utc_offset_minutes?: number;
    price_level?: number;
    opening_hours?: OpeningHours;
    plus_code?: PlusCode;
    user_ratings_total?: number;
  }

  interface AutocompletePrediction {
    description: string;
    place_id: string;
    structured_formatting?: {
      main_text: string;
      main_text_matched_substrings: {
        length: number;
        offset: number;
      }[];
      secondary_text: string;
      secondary_text_matched_substrings?: {
        length: number;
        offset: number;
      }[];
    };
    matched_substrings: {
      length: number;
      offset: number;
    }[];
    terms: {
      offset: number;
      value: string;
    }[];
    types: string[];
  }
}
