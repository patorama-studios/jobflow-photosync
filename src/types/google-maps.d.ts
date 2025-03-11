
declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getPlace(): google.maps.places.PlaceResult;
        setBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): void;
        setComponentRestrictions(restrictions: ComponentRestrictions): void;
        setFields(fields: string[]): void;
        setOptions(options: AutocompleteOptions): void;
        setTypes(types: string[]): void;
      }

      interface AutocompleteOptions {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        placeIdOnly?: boolean;
        strictBounds?: boolean;
        types?: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      interface PlaceResult {
        address_components?: AddressComponent[];
        adr_address?: string;
        formatted_address?: string;
        geometry?: PlaceGeometry;
        html_attributions?: string[];
        icon?: string;
        id?: string;
        name?: string;
        place_id?: string;
        plus_code?: string;
        reference?: string;
        scope?: string;
        types?: string[];
        url?: string;
        utc_offset?: number;
        vicinity?: string;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }

      interface PlaceGeometry {
        location: google.maps.LatLng;
        viewport: google.maps.LatLngBounds;
      }
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): google.maps.LatLngLiteral;
      equals(other: google.maps.LatLng | google.maps.LatLngLiteral): boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: google.maps.LatLng | google.maps.LatLngLiteral, ne?: google.maps.LatLng | google.maps.LatLngLiteral);
      contains(latLng: google.maps.LatLng | google.maps.LatLngLiteral): boolean;
      equals(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): boolean;
      extend(point: google.maps.LatLng | google.maps.LatLngLiteral): google.maps.LatLngBounds;
      getCenter(): google.maps.LatLng;
      getNorthEast(): google.maps.LatLng;
      getSouthWest(): google.maps.LatLng;
      intersects(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): google.maps.LatLngBoundsLiteral;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): google.maps.LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}
