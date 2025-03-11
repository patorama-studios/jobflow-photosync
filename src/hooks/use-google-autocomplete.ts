
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

interface UseGoogleAutocompleteOptions {
  apiKey?: string;
  defaultValue?: string;
  componentRestrictions?: {
    country: string | string[];
  };
  types?: string[];
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  fields?: string[];
}

interface Address {
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

interface UseGoogleAutocompleteReturn {
  value: string;
  setValue: (value: string) => void;
  suggestions: google.maps.places.AutocompletePrediction[];
  loading: boolean;
  error: string | null;
  handleSelect: (prediction: google.maps.places.AutocompletePrediction) => Promise<Address | null>;
  inputRef: React.RefObject<HTMLInputElement>;
  ready: boolean;
}

export function useGoogleAutocomplete(options: UseGoogleAutocompleteOptions = {}): UseGoogleAutocompleteReturn {
  const { isLoaded } = useGoogleMaps();
  const [value, setValue] = useState(options.defaultValue || '');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dummyElRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize services
  useEffect(() => {
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }
    
    try {
      // Create AutocompleteService
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div element for PlacesService if not already created
      if (!dummyElRef.current) {
        dummyElRef.current = document.createElement('div');
      }
      
      // Create PlacesService
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyElRef.current);
      
      setReady(true);
    } catch (err: any) {
      console.error('Error initializing Google Maps services:', err);
      setError(err.message || 'Failed to initialize Google Maps services');
    }
  }, [isLoaded]);
  
  // Fetch suggestions as the user types
  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 3 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const request = {
        input,
        componentRestrictions: options.componentRestrictions || { country: 'au' },
        types: options.types || ['address'],
        bounds: options.bounds,
      };
      
      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setLoading(false);
          
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
            if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              // This is normal when no matches are found
              return;
            }
            
            setError(`Error fetching suggestions: ${status}`);
            return;
          }
          
          setSuggestions(predictions);
        }
      );
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error fetching address suggestions');
      console.error('Error fetching address suggestions:', err);
    }
  }, [options.bounds, options.componentRestrictions, options.types]);
  
  // Handle selection of a suggestion
  const handleSelect = useCallback(async (prediction: google.maps.places.AutocompletePrediction): Promise<Address | null> => {
    if (!placesServiceRef.current) {
      setError('Places service not initialized');
      return null;
    }
    
    return new Promise((resolve, reject) => {
      const request = {
        placeId: prediction.place_id,
        fields: options.fields || ['address_components', 'formatted_address', 'geometry']
      };
      
      placesServiceRef.current!.getDetails(request, (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          setError(`Error fetching place details: ${status}`);
          reject(new Error(`Error fetching place details: ${status}`));
          return;
        }
        
        const address: Address = {
          formattedAddress: place.formatted_address || prediction.description,
          placeId: place.place_id
        };
        
        // Extract address components
        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            
            if (types.includes('street_number')) {
              address.streetNumber = component.long_name;
            } else if (types.includes('route')) {
              address.streetName = component.long_name;
            } else if (types.includes('locality')) {
              address.city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              address.state = component.short_name;
            } else if (types.includes('postal_code')) {
              address.postalCode = component.long_name;
            } else if (types.includes('country')) {
              address.country = component.long_name;
            }
          }
        }
        
        // Extract coordinates
        if (place.geometry && place.geometry.location) {
          address.lat = place.geometry.location.lat();
          address.lng = place.geometry.location.lng();
        }
        
        // Update the input value
        setValue(address.formattedAddress);
        
        // Clear suggestions
        setSuggestions([]);
        
        resolve(address);
      });
    });
  }, [options.fields]);
  
  // Update suggestions when the input value changes
  useEffect(() => {
    if (ready) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [value, fetchSuggestions, ready]);
  
  return {
    value,
    setValue,
    suggestions,
    loading,
    error,
    handleSelect,
    inputRef,
    ready
  };
}
