
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

interface GoogleAddressAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onAddressSelect?: (place: any) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const GoogleAddressAutocomplete = React.forwardRef<HTMLInputElement, GoogleAddressAutocompleteProps>(
  ({ value = '', onChange, onAddressSelect, placeholder = 'Search for an address...', className, error }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<any>(null);
    const { isLoaded, googleMapsError } = useGoogleMaps();
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

      try {
        // Initialize Google Maps autocomplete
        const autocompleteOptions = {
          componentRestrictions: { country: 'au' },
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        };

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          autocompleteOptions
        );

        // Add place_changed event listener
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          // Update the input value with the formatted address
          if (place.formatted_address) {
            setInputValue(place.formatted_address);
            onChange(place.formatted_address);
          }
          
          // Call onAddressSelect callback if provided
          if (onAddressSelect && place) {
            onAddressSelect(place);
          }
        });
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
      }
    }, [isLoaded, onChange, onAddressSelect]);

    // Handle manual input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);
    };

    return (
      <div className="relative w-full">
        <FormControl>
          <Input
            ref={(node) => {
              // Handle both the forwarded ref and our internal ref
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              inputRef.current = node;
            }}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "w-full",
              error && "border-destructive",
              className
            )}
          />
        </FormControl>
        {googleMapsError && (
          <div className="text-xs text-destructive mt-1">
            {String(googleMapsError)}
          </div>
        )}
      </div>
    );
  }
);

GoogleAddressAutocomplete.displayName = 'GoogleAddressAutocomplete';
