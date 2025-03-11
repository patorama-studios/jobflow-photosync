
export {};

declare global {
  namespace google.maps {
    namespace places {
      class Autocomplete {
        constructor(inputElement: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: (...args: any[]) => void): any;
        getPlace(): Place;
        setBounds(bounds: LatLngBounds): void;
        setComponentRestrictions(restrictions: ComponentRestrictions): void;
        setFields(fields: string[]): void;
        setOptions(options: AutocompleteOptions): void;
        setTypes(types: string[]): void;
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          main_text_matched_substrings: {
            offset: number;
            length: number;
          }[];
          secondary_text: string;
        };
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        placeIdOnly?: boolean;
        strictBounds?: boolean;
        types?: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      interface Place {
        address_components: AddressComponent[];
        formatted_address: string;
        geometry: {
          location: LatLng;
          viewport: LatLngBounds;
        };
        place_id: string;
        name: string;
        types: string[];
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }
  }
}
