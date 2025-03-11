
declare namespace google.maps {
  namespace places {
    class Autocomplete {
      constructor(inputElement: HTMLInputElement, options?: AutocompleteOptions);
      addListener(eventName: string, handler: Function): any;
      getPlace(): PlaceResult;
    }
    
    interface AutocompleteOptions {
      types?: string[];
      componentRestrictions?: {
        country: string | string[];
      };
    }
    
    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: {
        location: LatLng;
      };
      name?: string;
      place_id?: string;
      types?: string[];
    }
    
    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }
  }
  
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }
}
