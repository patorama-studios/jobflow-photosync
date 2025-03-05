
import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDefaultRegion, GoogleMapsTypes } from '@/lib/google-maps';

interface GoogleAddressAutocompleteProps {
  onAddressSelect: (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  region?: string;
}

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onAddressSelect,
  placeholder = "Search an address...",
  defaultValue = "",
  className = "",
  required = false,
  region
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsTypes.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  
  useEffect(() => {
    if (!window.google || !inputRef.current) return;
    
    // Get the default region (Australia) or use provided region
    const preferredRegion = region || getDefaultRegion();
    
    // Initialize Google Autocomplete with region preference
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['address_components', 'formatted_address', 'geometry'],
      componentRestrictions: { country: preferredRegion }
    });
    
    // Add listener for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      if (!place.address_components || !place.geometry?.location) return;
      
      // Extract address components
      let streetNumber = '';
      let route = '';
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
            route = component.long_name;
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
      
      const streetAddress = streetNumber && route ? `${streetNumber} ${route}` : route;
      setInputValue(place.formatted_address || '');
      
      onAddressSelect({
        formattedAddress: place.formatted_address || '',
        streetAddress,
        city,
        state,
        postalCode,
        country,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    });
    
    // Cleanup
    return () => {
      if (window.google && autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect, region]);
  
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`pl-9 ${className}`}
        required={required}
      />
    </div>
  );
};
