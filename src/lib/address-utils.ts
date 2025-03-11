export interface AddressDetails {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export function parseGoogleAddress(placeResult: google.maps.places.PlaceResult): AddressDetails {
  let streetAddress = '';
  let city = '';
  let state = '';
  let postalCode = '';
  let lat = 0;
  let lng = 0;

  if (placeResult.address_components) {
    for (const component of placeResult.address_components) {
      const types = component.types;

      if (types.includes('street_number')) {
        streetAddress = component.long_name;
      } else if (types.includes('route')) {
        streetAddress += (streetAddress ? ' ' : '') + component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }
  }

  if (placeResult.geometry?.location) {
    lat = placeResult.geometry.location.lat();
    lng = placeResult.geometry.location.lng();
  }

  return {
    formattedAddress: placeResult.formatted_address || '',
    streetAddress,
    city,
    state,
    postalCode,
    lat,
    lng
  };
}
