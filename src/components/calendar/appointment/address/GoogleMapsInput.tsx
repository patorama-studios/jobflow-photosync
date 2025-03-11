
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleAutocomplete } from '@/hooks/use-google-autocomplete';
import { Input } from '@/components/ui/input';
import { extractAddressComponents } from '@/lib/address-utils';
import { AddressDetails } from '@/types/google-maps-types';

interface GoogleMapsInputProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export const GoogleMapsInput: React.FC<GoogleMapsInputProps> = ({
  onAddressSelect,
  defaultValue = '',
  placeholder = 'Enter an address',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const { initAutocomplete, isLoaded, error } = useGoogleAutocomplete();

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = initAutocomplete(inputRef.current);
      
      if (autocomplete) {
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (place.geometry) {
            const addressDetails = extractAddressComponents(place);
            setInputValue(addressDetails.formattedAddress);
            onAddressSelect(addressDetails);
          }
        });
      }
    }
  }, [isLoaded, initAutocomplete, onAddressSelect]);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleManualBlur = () => {
    if (inputValue) {
      // We don't process manually entered addresses here
      // because we rely on Google Places API to format it properly
    }
  };

  return (
    <div className={className}>
      {error && <div className="text-red-500 text-sm mb-2">{String(error)}</div>}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleManualBlur}
        className="w-full"
      />
    </div>
  );
};
