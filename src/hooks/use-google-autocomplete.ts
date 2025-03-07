
import { useRef, useState, useCallback, useEffect } from 'react';
import { getDefaultRegion } from '@/lib/google-maps';
import { convertPlaceToAddress, ParsedAddress } from '@/lib/address-utils';
import { toast } from 'sonner';

interface GoogleAutocompleteOptions {
  onAddressSelect: (address: ParsedAddress) => void;
  defaultValue?: string;
  region?: string;
}

export function useGoogleAutocomplete({
  onAddressSelect,
  defaultValue = '',
  region
}: GoogleAutocompleteOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    console.log("Selected place:", place);
    
    if (!place.address_components || !place.geometry?.location) {
      console.error("Incomplete place data received:", place);
      toast.error("Incomplete address selected. Please try a different address.");
      return;
    }
    
    const addressData = convertPlaceToAddress(place);
    
    if (addressData) {
      setInputValue(addressData.formattedAddress);
      onAddressSelect(addressData);
    } else {
      console.error("Failed to parse address data from place:", place);
      toast.error("Could not process the selected address. Please try again or enter manually.");
    }
  }, [onAddressSelect]);
  
  const initializeAutocomplete = useCallback(() => {
    // Skip if component is already initialized or input ref isn't available
    if (!inputRef.current || isInitialized) {
      return;
    }
    
    // Check if Google Maps API is loaded
    if (!window.google?.maps?.places) {
      console.error("Google Maps Places API not loaded");
      setError("Google Maps not loaded");
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
      setError(null);
      console.log("Google Maps Places Autocomplete initialized successfully");
      
      // Add listener for place selection
      const listener = autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
      
      return () => {
        if (window.google && window.google.maps && listener) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current!);
        }
      };
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err);
      setError("Failed to initialize address search");
      return undefined;
    }
  }, [isInitialized, region, handlePlaceChanged]);
  
  // Initialize autocomplete when Google Maps API is loaded
  useEffect(() => {
    const cleanup = initializeAutocomplete();
    return cleanup;
  }, [initializeAutocomplete, window.google?.maps?.places]);
  
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
  
  // Allow focusing the input to show suggestions and re-initialize if needed
  const handleInputFocus = () => {
    if (!isInitialized && window.google?.maps?.places) {
      initializeAutocomplete();
    }
  };
  
  return {
    inputRef,
    inputValue,
    error,
    handleInputChange,
    handleInputFocus,
    isInitialized
  };
}
