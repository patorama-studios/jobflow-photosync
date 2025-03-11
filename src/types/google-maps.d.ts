
// Type definitions for Google Maps JavaScript API 3.46
// Project: https://developers.google.com/maps/
// TypeScript Version: 3.0

declare namespace google.maps {
    // Missing type definitions
    class LatLngBounds {
        constructor(sw?: LatLng | null, ne?: LatLng | null);
        contains(latLng: LatLng): boolean;
        equals(other: LatLngBounds | null | undefined): boolean;
        extend(point: LatLng | LatLngLiteral): LatLngBounds;
        getCenter(): LatLng;
        getNorthEast(): LatLng;
        getSouthWest(): LatLng;
        intersects(other: LatLngBounds | null | undefined): boolean;
        isEmpty(): boolean;
        toJSON(): LatLngBoundsLiteral;
        toSpan(): LatLng;
        toString(): string;
        toUrlValue(precision?: number): string;
        union(other: LatLngBounds | null | undefined): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
        east: number;
        north: number;
        south: number;
        west: number;
    }

    namespace places {
        interface AutocompletePrediction {
            description: string;
            matched_substrings: Array<{ length: number; offset: number }>;
            place_id: string;
            reference: string;
            structured_formatting: {
                main_text: string;
                main_text_matched_substrings: Array<{ length: number; offset: number }>;
                secondary_text: string;
            };
            terms: Array<{ offset: number; value: string }>;
            types: string[];
        }

        interface AutocompleteRequest {
            bounds?: LatLngBounds | LatLngBoundsLiteral;
            componentRestrictions?: ComponentRestrictions;
            input: string;
            location?: LatLng;
            offset?: number;
            origin?: LatLng | LatLngLiteral;
            radius?: number;
            sessionToken?: AutocompleteSessionToken;
            types?: string[] | string;
        }

        interface ComponentRestrictions {
            country: string | string[];
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
            location?: LatLng;
            viewport?: LatLngBounds;
        }
    }

    // Geocoder types
    interface GeocoderResult {
        address_components: {
            long_name: string;
            short_name: string;
            types: string[];
        }[];
        formatted_address: string;
        geometry: {
            bounds?: LatLngBounds;
            location: LatLng;
            location_type?: string;
            viewport: LatLngBounds;
        };
        place_id: string;
        plus_code?: {
            compound_code: string;
            global_code: string;
        };
        types: string[];
    }

    interface GeocoderResponse {
        results: GeocoderResult[];
        status: GeocoderStatus;
    }

    enum GeocoderStatus {
        ERROR = "ERROR",
        INVALID_REQUEST = "INVALID_REQUEST",
        OK = "OK",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
        ZERO_RESULTS = "ZERO_RESULTS"
    }
}
