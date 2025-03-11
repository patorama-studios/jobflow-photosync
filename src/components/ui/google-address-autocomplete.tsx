
import React, { useRef, useEffect, useState, InputHTMLAttributes } from 'react';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface GoogleAddressAutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
}

export function GoogleAddressAutocomplete({
  label,
  className,
  onChange,
  onAddressSelect,
  id = 'google-address-autocomplete',
  ...props
}: GoogleAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, error, initAutocomplete } = useGoogleMaps();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocomplete) {
      try {
        const autoCompleteInstance = initAutocomplete(inputRef.current);
        setAutocomplete(autoCompleteInstance);

        // Add place_changed event listener
        autoCompleteInstance.addListener('place_changed', () => {
          const place = autoCompleteInstance.getPlace();
          const address = {
            formattedAddress: place.formatted_address || '',
            streetAddress: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          };

          // Extract address components
          if (place.address_components) {
            for (const component of place.address_components) {
              const componentType = component.types[0];

              switch (componentType) {
                case 'street_number':
                  address.streetAddress = component.long_name;
                  break;
                case 'route':
                  address.streetAddress += ' ' + component.long_name;
                  break;
                case 'locality':
                  address.city = component.long_name;
                  break;
                case 'administrative_area_level_1':
                  address.state = component.short_name;
                  break;
                case 'postal_code':
                  address.postalCode = component.long_name;
                  break;
                case 'country':
                  address.country = component.long_name;
                  break;
              }
            }
          }

          // Update the input field value
          if (inputRef.current) {
            inputRef.current.value = place.formatted_address || '';
            onChange(place.formatted_address || '');
          }

          // Call the onAddressSelect callback if provided
          if (onAddressSelect) {
            onAddressSelect(address);
          }
        });
      } catch (e) {
        console.error('Error initializing Google Places Autocomplete:', e);
      }
    }
  }, [isLoaded, initAutocomplete, onChange, onAddressSelect, autocomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        id={id}
        type="text"
        ref={inputRef}
        onChange={handleInputChange}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      {!isLoaded && <p className="text-muted-foreground text-sm">Loading Google Maps...</p>}
    </div>
  );
}
