
import { useState, useEffect, useRef, useCallback } from 'react';

export interface Address {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  placeId?: string;
}

export const useGoogleAutocomplete = () => {
  const [address, setAddress] = useState<Address>({
    formattedAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    placeId: ''
  });
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Function to initialize the Autocomplete
  const initAutocomplete = useCallback((input: HTMLInputElement) => {
    inputRef.current = input;
    
    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        const options = {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry', 'place_id']
        };
        
        autocompleteRef.current = new google.maps.places.Autocomplete(input, options);
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current!.getPlace();
          
          if (!place.address_components) {
            setError('No details available for this place');
            return;
          }
          
          let streetNumber = '';
          let streetName = '';
          let city = '';
          let state = '';
          let postalCode = '';
          let country = '';
          
          for (const component of place.address_components) {
            const componentType = component.types[0];
            
            switch (componentType) {
              case 'street_number':
                streetNumber = component.long_name;
                break;
              case 'route':
                streetName = component.long_name;
                break;
              case 'locality':
                city = component.long_name;
                break;
              case 'administrative_area_level_1':
                state = component.short_name;
                break;
              case 'postal_code':
                postalCode = component.long_name;
                break;
              case 'country':
                country = component.long_name;
                break;
            }
          }
          
          const streetAddress = streetNumber ? `${streetNumber} ${streetName}` : streetName;
          
          const newAddress: Address = {
            formattedAddress: place.formatted_address || '',
            streetAddress,
            city,
            state,
            postalCode,
            country,
            placeId: place.place_id
          };
          
          setAddress(newAddress);
          setInputValue(place.formatted_address || '');
          setError(null);
        });
      } else {
        setError('Google Maps API not loaded');
      }
    } catch (err) {
      console.error('Error initializing Google Autocomplete:', err);
      setError('Failed to initialize address autocomplete');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.setAttribute('autocomplete', 'new-password');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        // Clean up logic if needed
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const updateAddress = (newAddress: Address) => {
    setAddress(newAddress);
    setInputValue(newAddress.formattedAddress);
  };

  return {
    address,
    inputRef,
    inputValue,
    error,
    initAutocomplete,
    handleInputChange,
    handleInputFocus,
    updateAddress
  };
};
