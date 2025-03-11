
// Types for Google Maps Place API
export interface AddressDetails {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

export interface GeocoderResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
    viewport: {
      northeast: {
        lat: () => number;
        lng: () => number;
      };
      southwest: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
  place_id: string;
  types: string[];
}
