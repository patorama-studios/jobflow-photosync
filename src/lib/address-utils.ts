
import { toast } from 'sonner';

interface ExtractedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface AddressObject {
  formatted_address: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

/**
 * Extracts address components from a Google Places result
 */
export function extractAddressComponents(place: google.maps.places.PlaceResult): ExtractedAddress {
  const result: ExtractedAddress = {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };
  
  if (!place.address_components) {
    return result;
  }
  
  let streetNumber = '';
  let route = '';
  
  // Extract each component
  for (const component of place.address_components) {
    const types = component.types;
    
    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality')) {
      result.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      result.state = component.short_name;
    } else if (types.includes('postal_code')) {
      result.zip = component.long_name;
    } else if (types.includes('country')) {
      result.country = component.long_name;
    }
  }
  
  // Combine street number and route to form street address
  result.street = streetNumber ? `${streetNumber} ${route}` : route;
  
  // Add coordinates if available
  if (place.geometry && place.geometry.location) {
    result.lat = place.geometry.location.lat();
    result.lng = place.geometry.location.lng();
  }
  
  return result;
}

/**
 * Geocodes an address string to get coordinates and address components
 */
export async function geocodeAddress(address: string): Promise<AddressObject | null> {
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    toast.error('Google Maps API not loaded');
    return null;
  }
  
  const geocoder = new window.google.maps.Geocoder();
  
  try {
    const response = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
    
    const firstResult = response[0];
    const components = extractAddressComponents(firstResult);
    
    return {
      formatted_address: firstResult.formatted_address || address,
      street_address: components.street,
      city: components.city,
      state: components.state,
      postal_code: components.zip,
      country: components.country,
      lat: components.lat,
      lng: components.lng,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    toast.error('Failed to geocode address');
    return null;
  }
}

/**
 * Gets a URL for a static map image
 */
export function getStaticMapUrl(address: AddressObject, apiKey: string, size = '600x300'): string {
  const { lat, lng } = address;
  
  if (lat && lng) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${size}&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
  }
  
  // Fallback to using the address string
  const encodedAddress = encodeURIComponent(address.formatted_address);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=${size}&markers=color:red%7C${encodedAddress}&key=${apiKey}`;
}
