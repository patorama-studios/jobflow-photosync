
import { useRef, useState, useEffect, useCallback } from 'react';
import { Address } from '@/types/google-maps-types';

interface UseGoogleAutocompleteProps {
  defaultAddress?: Partial<Address>;
  onAddressSelect?: (address: Address) => void;
}

export const useGoogleAutocomplete = (props?: UseGoogleAutocompleteProps) => {
  const { defaultAddress, onAddressSelect } = props || {};
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState<Address>({
    street: defaultAddress?.street || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zip: defaultAddress?.zip || '',
    formatted: defaultAddress?.formatted || '',
    lat: defaultAddress?.lat,
    lng: defaultAddress?.lng
  });

  const parseAddressComponents = useCallback((place: google.maps.places.PlaceResult): Address => {
    let street = '';
    let city = '';
    let state = '';
    let zip = '';
    let lat = place.geometry?.location?.lat();
    let lng = place.geometry?.location?.lng();

    place.address_components?.forEach(component => {
      const types = component.types;

      if (types.includes('street_number')) {
        street = component.long_name + ' ' + street;
      } else if (types.includes('route')) {
        street = street + component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        zip = component.long_name;
      }
    });

    return {
      street,
      city,
      state,
      zip,
      formatted: place.formatted_address || '',
      lat,
      lng
    };
  }, []);

  const initAutocomplete = useCallback((input: HTMLInputElement) => {
    if (!input || !window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps API not loaded');
      return;
    }

    inputRef.current = input;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: 'au' }
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (place && place.address_components) {
          const newAddress = parseAddressComponents(place);
          setAddress(newAddress);
          onAddressSelect?.(newAddress);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Autocomplete:', error);
    }
  }, [onAddressSelect, parseAddressComponents]);

  return {
    initAutocomplete,
    address
  };
};
