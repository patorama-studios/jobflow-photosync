
import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

interface GoogleAddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter address',
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded, error } = useGoogleMaps();
  
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          { types: ['address'], componentRestrictions: { country: 'au' } }
        );
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (place && place.formatted_address) {
            onChange(place.formatted_address);
            if (onSelect) onSelect(place);
          }
        });
      } catch (err) {
        console.error('Error initializing Google Maps autocomplete:', err);
      }
    }
  }, [isLoaded, onChange, onSelect]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  if (error) {
    return (
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  
  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={!isLoaded}
    />
  );
};
