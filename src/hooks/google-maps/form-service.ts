
import { AddressDetails } from './types';

/**
 * Updates form values with address details from Google Places API
 * with robust error handling
 */
export const updateFormWithPlaceDetails = (
  place: any,
  prediction: any,
  form: any
): AddressDetails | null => {
  if (!form || (typeof form.setValue !== 'function')) {
    console.error('Invalid form object passed to updateFormWithPlaceDetails');
    return null;
  }

  try {
    // Set address fields
    const formattedAddress = place?.formatted_address || prediction?.formatted_address || '';
    form.setValue('address', formattedAddress);
    form.setValue('propertyAddress', formattedAddress);

    // Extract address components if available
    if (place?.address_components) {
      let city = '';
      let state = '';
      let zip = '';
      let streetAddress = '';
      let streetNumber = '';
      let route = '';
      
      // Process each address component
      for (const component of place.address_components) {
        const types = component.types;
        
        if (types.includes('locality')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.short_name;
        } else if (types.includes('postal_code')) {
          zip = component.long_name;
        } else if (types.includes('street_number')) {
          streetNumber = component.long_name;
        } else if (types.includes('route')) {
          route = component.long_name;
        }
      }
      
      // Build the street address
      streetAddress = streetNumber ? `${streetNumber} ${route}`.trim() : route;
      
      // Update form with extracted components
      if (city) form.setValue('city', city);
      if (state) form.setValue('state', state);
      if (zip) form.setValue('zip', zip);
      if (streetAddress) form.setValue('streetAddress', streetAddress);
      
      console.log('Updated form with place details:', { city, state, zip, streetAddress });
      
      return { 
        city, 
        state, 
        zip, 
        streetAddress,
        formatted_address: formattedAddress 
      };
    }
    
    return {
      formatted_address: formattedAddress
    };
  } catch (error) {
    console.error('Error updating form with place details:', error);
    // Return minimal object to prevent crashes
    return {
      formatted_address: place?.formatted_address || prediction?.formatted_address || ''
    };
  }
};
