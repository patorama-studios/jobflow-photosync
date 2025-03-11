
import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { Input } from './input';
import { useGoogleAutocomplete } from '@/hooks/use-google-autocomplete';
import { cn } from '@/lib/utils';

interface GoogleAddressAutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onAddressSelect?: (place: google.maps.places.PlaceResult) => void;
  onChange?: (value: string) => void;
  country?: string;
  className?: string;
}

export const GoogleAddressAutocomplete = forwardRef<HTMLInputElement, GoogleAddressAutocompleteProps>(
  ({ onAddressSelect, onChange, country = 'au', className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { predictions, searchPlaces, getPlaceDetails } = useGoogleAutocomplete({
      country,
      types: 'address'
    });

    useEffect(() => {
      if (inputValue.length > 2) {
        searchPlaces(inputValue);
      }
    }, [inputValue, searchPlaces]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setShowSuggestions(true);
      if (onChange) onChange(value);
    };

    const handleSelectPlace = async (placeId: string, description: string) => {
      try {
        setInputValue(description);
        setShowSuggestions(false);
        if (onChange) onChange(description);
        
        if (onAddressSelect) {
          const placeDetails = await getPlaceDetails(placeId);
          if (placeDetails) {
            onAddressSelect(placeDetails);
          }
        }
      } catch (error) {
        console.error('Error getting place details:', error);
      }
    };

    return (
      <div className="relative">
        <Input
          type="text"
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={cn("w-full", className)}
          {...props}
        />
        
        {showSuggestions && predictions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
                onMouseDown={() => handleSelectPlace(prediction.place_id, prediction.description)}
              >
                {prediction.structured_formatting ? (
                  <>
                    <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                    <div className="text-sm text-muted-foreground">{prediction.structured_formatting.secondary_text}</div>
                  </>
                ) : (
                  <div>{prediction.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

GoogleAddressAutocomplete.displayName = 'GoogleAddressAutocomplete';
