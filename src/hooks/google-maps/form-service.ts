
import { PlaceResult } from './types';

/**
 * Updates form values with address details from Google Places API
 */
export const updateFormWithPlaceDetails = (
  place: google.maps.places.PlaceResult | null,
  prediction: PlaceResult,
  form: any
) => {
  // Set address fields
  form.setValue('address', place?.formatted_address || prediction.formatted_address || '');
  form.setValue('propertyAddress', place?.formatted_address || prediction.formatted_address || '');

  if (place?.address_components) {
    let city = '';
    let state = '';
    let zip = '';
    
    for (const component of place.address_components) {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        zip = component.long_name;
      }
    }
    
    // Update form with address components
    form.setValue('city', city);
    form.setValue('state', state);
    form.setValue('zip', zip);
    
    return { city, state, zip };
  }
  
  return null;
};
