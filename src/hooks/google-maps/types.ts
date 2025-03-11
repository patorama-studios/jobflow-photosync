
export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  name?: string;
  address_components?: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Add missing type definitions for window.google
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (attrContainer: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: google.maps.places.PlacesServiceStatus;
        };
      };
    };
  }
}
