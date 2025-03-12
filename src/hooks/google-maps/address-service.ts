
import { AddressDetails } from './types';
import { updateFormWithPlaceDetails } from './form-service';

/**
 * Processes place details from Google Maps API and updates the form
 */
export const handlePlaceDetails = (
  place: any,
  prediction: any,
  form: any
): AddressDetails | null => {
  if (!place) {
    // If no place details available, use prediction data
    return updateFormWithPlaceDetails(null, prediction, form);
  }

  // Process place details and update form
  return updateFormWithPlaceDetails(place, prediction, form);
};
