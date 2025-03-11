
import { useState, useEffect, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PlaceResult } from './google-maps/types';
import { useGoogleMapsServices } from './google-maps/use-google-maps-services';
import { handlePlaceDetails } from './google-maps/address-service';

/**
 * Hook for Google address search functionality with form integration
 */
export function useGoogleAddressSearch(form: UseFormReturn<any>) {
  const [showManualFields, setShowManualFields] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { autocompleteService, placesService, isLoaded } = useGoogleMapsServices();

  // Clear suggestions when the component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Effect to handle search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3 || !autocompleteService || !isLoaded) {
      setAddressSuggestions([]);
      setIsSearching(false);
      return;
    }
    
    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    setIsSearching(true);
    
    // Set new timeout
    debounceTimerRef.current = setTimeout(() => {
      const options = {
        input: searchQuery,
        componentRestrictions: { country: 'au' },
        types: ['address']
      };
      
      try {
        autocompleteService.getPlacePredictions(
          options,
          (predictions: google.maps.places.AutocompletePrediction[] | null, status: string) => {
            setIsSearching(false);
            
            if (status !== 'OK' || !predictions || predictions.length === 0) {
              setAddressSuggestions([]);
              return;
            }
            
            const results: PlaceResult[] = predictions.map((prediction) => ({
              place_id: prediction.place_id,
              formatted_address: prediction.description,
              name: prediction.structured_formatting?.main_text || prediction.description
            }));
            
            setAddressSuggestions(results);
          }
        );
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setIsSearching(false);
        setAddressSuggestions([]);
      }
    }, 300);
    
  }, [searchQuery, autocompleteService, isLoaded]);

  const handleAddressSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('address', query);
    setSearchQuery(query);
    
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, [form]);
  
  const handleSelectAddress = useCallback((prediction: PlaceResult) => {
    if (!placesService || !prediction.place_id) {
      form.setValue('address', prediction.formatted_address || '');
      setAddressSuggestions([]);
      return;
    }
    
    try {
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['address_components', 'formatted_address']
        },
        (place: google.maps.places.PlaceResult | null, status: string) => {
          if (status !== 'OK') {
            form.setValue('address', prediction.formatted_address || '');
            setAddressSuggestions([]);
            return;
          }
          
          handlePlaceDetails(place, prediction, form);
          setShowManualFields(true);
          setAddressSuggestions([]);
        }
      );
    } catch (error) {
      console.error("Error getting place details:", error);
      form.setValue('address', prediction.formatted_address || '');
      setAddressSuggestions([]);
    }
  }, [form, placesService]);
  
  const toggleManualFields = useCallback(() => {
    setShowManualFields(!showManualFields);
  }, [showManualFields]);

  return {
    showManualFields,
    addressSuggestions,
    isSearching,
    handleAddressSearch,
    handleSelectAddress,
    toggleManualFields
  };
}
