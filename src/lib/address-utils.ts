
/**
 * Utility functions for working with addresses and Google Maps autocomplete
 */

/**
 * Process place data from Google Maps autocomplete
 */
export interface AddressComponents {
  streetNumber: string;
  route: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ParsedAddress {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

/**
 * Parse address components from Google Maps place data
 */
export function parseAddressComponents(place: google.maps.places.PlaceResult): AddressComponents {
  if (!place.address_components) {
    return {
      streetNumber: '',
      route: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    };
  }

  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let postalCode = '';
  let country = '';
  
  for (const component of place.address_components) {
    const componentType = component.types[0];
    
    switch (componentType) {
      case 'street_number':
        streetNumber = component.long_name;
        break;
      case 'route':
        route = component.long_name;
        break;
      case 'locality':
        city = component.long_name;
        break;
      case 'administrative_area_level_1':
        state = component.short_name;
        break;
      case 'postal_code':
        postalCode = component.long_name;
        break;
      case 'country':
        country = component.long_name;
        break;
    }
  }

  return {
    streetNumber,
    route,
    city,
    state,
    postalCode,
    country
  };
}

/**
 * Convert Google Maps place data to a standardized address object
 */
export function convertPlaceToAddress(place: google.maps.places.PlaceResult): ParsedAddress | null {
  if (!place.geometry?.location || !place.address_components) {
    return null;
  }
  
  const components = parseAddressComponents(place);
  const streetAddress = components.streetNumber && components.route ? 
    `${components.streetNumber} ${components.route}` : components.route;
  
  return {
    formattedAddress: place.formatted_address || '',
    streetAddress,
    city: components.city,
    state: components.state,
    postalCode: components.postalCode,
    country: components.country,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  };
}
