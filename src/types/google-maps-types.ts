
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  formatted: string;
  lat?: number;
  lng?: number;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GooglePlaceResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id: string;
}

export interface GoogleAddressOptions {
  placeholder?: string;
  label?: string;
  required?: boolean;
  onAddressSelect?: (address: Address) => void;
  defaultAddress?: Partial<Address>;
  className?: string;
}
