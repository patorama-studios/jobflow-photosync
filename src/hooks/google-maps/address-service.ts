
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
    if (!place) {
      // If no place details available, use prediction data
      return updateFormWithPlaceDetails(null, prediction, form);
    }

    // Process place details and update form
    return updateFormWithPlaceDetails(place, prediction, form);
  } catch (error) {
    console.error('Error handling place details:', error);
    // Return minimal details to prevent app crashes
    return {
      formatted_address: prediction?.formatted_address || place?.formatted_address || ''
    };
  }
};
