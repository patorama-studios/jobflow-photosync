
import { AddressDetails } from '@/types/google-maps-types';

export function extractAddressComponents(place: google.maps.places.PlaceResult): AddressDetails {
  const addressDetails: AddressDetails = {
    formattedAddress: place.formatted_address || '',
    placeId: place.place_id,
  };

  if (place.geometry && place.geometry.location) {
    addressDetails.lat = place.geometry.location.lat();
    addressDetails.lng = place.geometry.location.lng();
  }

  if (!place.address_components) {
    return addressDetails;
  }

  for (const component of place.address_components) {
    if (component.types.includes('street_number')) {
      addressDetails.streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      addressDetails.streetName = component.long_name;
    } else if (component.types.includes('locality')) {
      addressDetails.city = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      addressDetails.state = component.short_name;
    } else if (component.types.includes('postal_code')) {
      addressDetails.postalCode = component.long_name;
    } else if (component.types.includes('country')) {
      addressDetails.country = component.long_name;
    }
  }

  return addressDetails;
}

export function getAddressCoordinates(address: string): Promise<{ lat: number, lng: number } | null> {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        console.error('Geocode was not successful:', status);
        resolve(null);
      }
    });
  });
}

export function formatAddress(addressDetails: AddressDetails): string {
  const parts: string[] = [];
  
  if (addressDetails.streetNumber && addressDetails.streetName) {
    parts.push(`${addressDetails.streetNumber} ${addressDetails.streetName}`);
  } else if (addressDetails.streetName) {
    parts.push(addressDetails.streetName);
  }
  
  if (addressDetails.city) {
    parts.push(addressDetails.city);
  }
  
  if (addressDetails.state) {
    parts.push(addressDetails.state);
  }
  
  if (addressDetails.postalCode) {
    parts.push(addressDetails.postalCode);
  }
  
  if (addressDetails.country) {
    parts.push(addressDetails.country);
  }
  
  return parts.join(', ');
}

export function geocodeAddress(address: string): Promise<google.maps.GeocoderResult[]> {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        resolve(results);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}
