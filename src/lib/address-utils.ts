
import { AddressDetails } from '@/hooks/google-maps/types';

// Type for address components returned by Google Maps API
export interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Type for a complete address
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lat?: number;
  lng?: number;
  formatted_address?: string;
}

// Extract address components from Google Places result
export const extractAddressComponents = (components: GoogleAddressComponent[]): AddressDetails => {
  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let zip = '';
  let country = '';

  components.forEach(component => {
    const types = component.types;

    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality')) {
      city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = component.short_name;
    } else if (types.includes('postal_code')) {
      zip = component.long_name;
    } else if (types.includes('country')) {
      country = component.long_name;
    }
  });

  return {
    streetAddress: streetNumber && route ? `${streetNumber} ${route}` : '',
    city,
    state,
    zip,
    country,
  };
};

// Format a complete address as a string
export const formatAddress = (address: Address): string => {
  if (address.formatted_address) {
    return address.formatted_address;
  }

  const parts = [];
  if (address.street) parts.push(address.street);
  
  const cityStateParts = [];
  if (address.city) cityStateParts.push(address.city);
  if (address.state) cityStateParts.push(address.state);
  
  if (cityStateParts.length > 0) {
    parts.push(cityStateParts.join(', '));
  }
  
  if (address.zip) parts.push(address.zip);
  
  return parts.join(', ');
};
