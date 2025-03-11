
declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (results: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: Element | Map);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        location?: LatLng | LatLngLiteral;
        offset?: number;
        radius?: number;
        types?: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
        sessionToken?: AutocompleteSessionToken;
      }

      interface AutocompletePrediction {
        description: string;
        matched_substrings: PredictionSubstring[];
        place_id: string;
        reference: string;
        structured_formatting: StructuredFormatting;
        terms: PredictionTerm[];
        types: string[];
      }

      interface PredictionTerm {
        offset: number;
        value: string;
      }

      interface PredictionSubstring {
        length: number;
        offset: number;
      }

      interface StructuredFormatting {
        main_text: string;
        main_text_matched_substrings: PredictionSubstring[];
        secondary_text: string;
      }

      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
        UNKNOWN_ERROR,
        NOT_FOUND
      }

      interface PlaceResult {
        address_components?: AddressComponent[];
        adr_address?: string;
        business_status?: string;
        formatted_address?: string;
        formatted_phone_number?: string;
        geometry?: PlaceGeometry;
        html_attributions?: string[];
        icon?: string;
        icon_background_color?: string;
        icon_mask_base_uri?: string;
        international_phone_number?: string;
        name?: string;
        opening_hours?: OpeningHours;
        permanently_closed?: boolean;
        photos?: PlacePhoto[];
        place_id?: string;
        plus_code?: PlusCode;
        price_level?: number;
        rating?: number;
        reviews?: PlaceReview[];
        types?: string[];
        url?: string;
        user_ratings_total?: number;
        utc_offset?: number;
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

      interface OpeningHours {
        isOpen(date?: Date): boolean;
        periods: OpeningPeriod[];
        weekday_text: string[];
      }

      interface OpeningPeriod {
        open: OpeningHoursTime;
        close?: OpeningHoursTime;
      }

      interface OpeningHoursTime {
        day: number;
        hours: number;
        minutes: number;
        nextDate?: Date;
        time?: string;
      }

      interface PlacePhoto {
        height: number;
        html_attributions: string[];
        width: number;
        getUrl(opts?: PhotoOptions): string;
      }

      interface PhotoOptions {
        maxHeight?: number;
        maxWidth?: number;
      }

      interface PlusCode {
        compound_code: string;
        global_code: string;
      }

      interface PlaceReview {
        author_name: string;
        author_url: string;
        language: string;
        profile_photo_url: string;
        rating: number;
        relative_time_description: string;
        text: string;
        time: number;
      }

      class AutocompleteSessionToken {}
    }
  }
}

export interface AddressDetails {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

export interface AddressComponents {
  street_number?: string;
  route?: string;
  neighborhood?: string;
  locality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  country?: string;
  postal_code?: string;
  [key: string]: string | undefined;
}
