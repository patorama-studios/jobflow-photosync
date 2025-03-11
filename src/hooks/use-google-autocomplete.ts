
import { useRef, useEffect, useState } from 'react';

interface GoogleAutocompleteOptions {
  componentRestrictions?: {
    country: string | string[];
  };
  types?: string[];
  bounds?: any;
}

interface AddressComponents {
  street_number?: string;
  route?: string;
  locality?: string;
  administrative_area_level_1?: string;
  country?: string;
  postal_code?: string;
}

interface Address {
  fullAddress: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export function useGoogleAutocomplete(options: GoogleAutocompleteOptions = {}) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const initAutocomplete = (input: HTMLInputElement) => {
    if (!input || !window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
      return;
    }

    // Set Australia as the default country restriction if none provided
    const defaultOptions: GoogleAutocompleteOptions = {
      componentRestrictions: { country: 'au' },
      ...options
    };

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(input, defaultOptions);
      
      autocompleteRef.current.addListener('place_changed', () => {
        if (!autocompleteRef.current) return;
        
        const place = autocompleteRef.current.getPlace();
        
        if (!place.address_components) {
          console.error("No address components found");
          return;
        }

        const components: AddressComponents = {};
        
        place.address_components.forEach(component => {
          if (component.types.includes('street_number')) {
            components.street_number = component.long_name;
          } else if (component.types.includes('route')) {
            components.route = component.long_name;
          } else if (component.types.includes('locality')) {
            components.locality = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            components.administrative_area_level_1 = component.short_name;
          } else if (component.types.includes('country')) {
            components.country = component.long_name;
          } else if (component.types.includes('postal_code')) {
            components.postal_code = component.long_name;
          }
        });

        setAddress({
          fullAddress: place.formatted_address || '',
          streetNumber: components.street_number || '',
          streetName: components.route || '',
          city: components.locality || '',
          state: components.administrative_area_level_1 || '',
          country: components.country || '',
          postalCode: components.postal_code || ''
        });
      });
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
    }
  };

  return {
    initAutocomplete,
    address
  };
}
