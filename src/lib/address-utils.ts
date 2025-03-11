export interface AddressComponents {
  street_number: string;
  route: string;
  locality: string;
  administrative_area_level_1: string;
  postal_code: string;
  country: string;
  formatted_address: string;
}

export async function getAddressComponents(address: string): Promise<AddressComponents | null> {
  try {
    // Mocked address components for testing purposes
    const addressComponents: AddressComponents = {
      street_number: '123',
      route: 'Fake Street',
      locality: 'Sydney',
      administrative_area_level_1: 'NSW',
      postal_code: '2000',
      country: 'AU',
      formatted_address: '123 Fake Street, Sydney NSW 2000, Australia'
    };
    return addressComponents;
  } catch (error) {
    console.error('Error getting address components:', error);
    return null;
  }
}

// Function to extract address components using Google Maps API
export async function getAddressComponentsFromGoogle(address: string): Promise<AddressComponents | null> {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  try {
    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise<google.maps.GeocoderResult[] | null>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results);
        } else {
          console.error('Geocoding failed due to:', status);
          resolve(null);
        }
      });
    });

    if (!result) return null;

    const addressResult = result[0];
    const components = addressResult.address_components;
    const addressComponents: AddressComponents = {
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      postal_code: '',
      country: '',
      formatted_address: addressResult.formatted_address
    };

    components.forEach(component => {
      const type = component.types[0];
      if (type in addressComponents) {
        addressComponents[type as keyof AddressComponents] = component.long_name;
      }
    });

    return addressComponents;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
