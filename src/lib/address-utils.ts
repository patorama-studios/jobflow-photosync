
/**
 * Utility functions for address handling
 */

export interface AddressComponents {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/**
 * Extracts address components from Google Place API result
 */
export const extractAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[] | undefined
): AddressComponents => {
  if (!addressComponents) {
    return {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    };
  }

  let street = '';
  let city = '';
  let state = '';
  let zip = '';
  let country = '';

  // Street number and street name
  const streetNumber = addressComponents.find(component => 
    component.types.includes('street_number')
  )?.long_name || '';
  
  const route = addressComponents.find(component => 
    component.types.includes('route')
  )?.long_name || '';
  
  if (streetNumber && route) {
    street = `${streetNumber} ${route}`;
  } else if (route) {
    street = route;
  }

  // City (locality)
  city = addressComponents.find(component => 
    component.types.includes('locality')
  )?.long_name || '';

  // State (administrative_area_level_1)
  state = addressComponents.find(component => 
    component.types.includes('administrative_area_level_1')
  )?.short_name || '';

  // Zip code (postal_code)
  zip = addressComponents.find(component => 
    component.types.includes('postal_code')
  )?.long_name || '';

  // Country
  country = addressComponents.find(component => 
    component.types.includes('country')
  )?.long_name || '';

  return {
    street,
    city,
    state,
    zip,
    country
  };
};

/**
 * Formats an address as a single line
 */
export const formatAddressOneLine = (components: AddressComponents): string => {
  const parts = [
    components.street,
    components.city,
    components.state,
    components.zip,
    components.country
  ].filter(Boolean);
  
  return parts.join(', ');
};
