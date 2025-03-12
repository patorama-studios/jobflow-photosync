
import { AddressDetails } from './types';
import { updateFormWithPlaceDetails } from './form-service';

/**
 * Processes place details from Google Maps API and updates the form
 * with error handling for missing or undefined data
 */
export const handlePlaceDetails = (
  place: any,
  prediction: any,
  form: any
): AddressDetails | null => {
  // Safety check for null inputs
  if (!form) {
    console.warn('Form is required for handlePlaceDetails');
    return null;
  }

  try {
    console.log('Handling place details:', { 
      place: place ? 'place data present' : 'no place data', 
      prediction: prediction ? 'prediction data present' : 'no prediction data' 
    });

    if (!place) {
      // If no place details available, use prediction data
      console.log('No place details available, using prediction data');
      return updateFormWithPlaceDetails(null, prediction, form);
    }

    // Process place details and update form
    console.log('Processing place details', { 
      formatted_address: place.formatted_address,
      has_components: !!place.address_components 
    });
    return updateFormWithPlaceDetails(place, prediction, form);
  } catch (error) {
    console.error('Error handling place details:', error);
    // Return minimal details to prevent app crashes
    return {
      formatted_address: prediction?.formatted_address || place?.formatted_address || ''
    };
  }
};
