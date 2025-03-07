
import React, { useEffect, useRef, useState, memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDefaultRegion } from '@/lib/google-maps';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Address {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

interface GoogleAddressAutocompleteProps {
  onAddressSelect: (address: Address) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  region?: string;
  disabled?: boolean;
  id?: string;
}

// Memoize the component to prevent unnecessary re-renders
export const GoogleAddressAutocomplete = memo(({
  onAddressSelect,
  placeholder = "Search an address...",
  defaultValue = "",
  className = "",
  required = false,
  region,
  disabled = false,
  id = "google-address-autocomplete"
}: GoogleAddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize autocomplete once when the component mounts
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not available");
      setError("Google Maps API not available");
      return;
    }

    // Skip if component is already initialized or input ref isn't available
    if (!inputRef.current || isInitialized) {
      return;
    }
    
    try {
      // Get the default region (Australia) or use provided region
      const preferredRegion = region || getDefaultRegion();
      
      // Initialize Google Autocomplete with region preference
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry'],
        componentRestrictions: { country: preferredRegion }
      });
      
      setIsInitialized(true);
      console.log("Google Maps Places Autocomplete initialized successfully");
      
      // Add listener for place selection
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        if (!autocompleteRef.current) return;
        
        const place = autocompleteRef.current.getPlace();
        console.log("Selected place:", place);
        
        if (!place.address_components || !place.geometry?.location) {
          toast.error("Incomplete address selected. Please try a different address.");
          return;
        }
        
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
      
      // Return cleanup function
      return () => {
        if (window.google && window.google.maps && autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err);
      setError("Failed to initialize address search");
      return undefined;
    }
  }, [onAddressSelect, region, isInitialized]);
  
  // Update input value when defaultValue changes
  useEffect(() => {
    if (defaultValue !== inputValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);
  
  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Allow focusing the input to show suggestions
  const handleInputFocus = () => {
    // Ensure autocomplete is set up correctly
    if (!isInitialized && inputRef.current && window.google?.maps?.places) {
      try {
        // Re-initialize if needed
        const preferredRegion = region || getDefaultRegion();
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry'],
          componentRestrictions: { country: preferredRegion }
        });
        setIsInitialized(true);
        console.log("Autocomplete re-initialized on focus");
      } catch (err) {
        console.error("Error re-initializing autocomplete:", err);
      }
    }
  };
  
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <Input
        id={id}
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={error ? `${error} - ${placeholder}` : placeholder}
        className={cn("pl-9", className)}
        required={required}
        disabled={disabled}
        aria-label="Address search"
        autoComplete="off"
      />
      {error && (
        <div className="text-sm text-destructive mt-1">
          {error}. You may need to enter the address manually.
        </div>
      )}
    </div>
  );
});

GoogleAddressAutocomplete.displayName = 'GoogleAddressAutocomplete';
