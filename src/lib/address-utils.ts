
import { AddressComponents, AddressDetails } from '@/types/google-maps-types';

export function extractAddressComponents(place: google.maps.places.PlaceResult): AddressDetails {
  // Create the initial address details object with default values
  const addressDetails: AddressDetails = {
    formattedAddress: place.formatted_address || '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0
  };
  
  // Extract components from place.address_components
  if (place.address_components && place.address_components.length > 0) {
    // First, build a map of component types to their values
    const components: AddressComponents = {};
    
    for (const component of place.address_components) {
      for (const type of component.types) {
        components[type] = component.long_name;
        
        // For administrative areas, also store the short name (e.g., "CA" instead of "California")
        if (type === 'administrative_area_level_1') {
          components['administrative_area_level_1_short'] = component.short_name;
        }
      }
    }
    
    // Now build the address parts from the components
    const streetNumber = components.street_number || '';
    const route = components.route || '';
    
    // Build street address
    addressDetails.streetAddress = streetNumber ? `${streetNumber} ${route}`.trim() : route;
    
    // Set city (prefer locality, but use sublocality or neighborhood as fallbacks)
    addressDetails.city = 
      components.locality || 
      components.sublocality || 
      components.neighborhood || 
      components.administrative_area_level_2 || '';
    
    // Set state (use short version if available, e.g., "CA" instead of "California")
    addressDetails.state = components.administrative_area_level_1_short || components.administrative_area_level_1 || '';
    
    // Set postal code and country
    addressDetails.postalCode = components.postal_code || '';
    addressDetails.country = components.country || '';
  }
  
  return addressDetails;
}

// Helper function to check if an address is valid
export function isValidAddress(address: AddressDetails): boolean {
  return !!(
    address.streetAddress && 
    address.city && 
    address.state && 
    address.postalCode
  );
}
