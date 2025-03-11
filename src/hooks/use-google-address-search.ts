
import { useState, useEffect } from 'react';
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
  
  const { autocompleteService, placesService, isLoaded } = useGoogleMapsServices();

  // Effect to handle search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3 || !autocompleteService || !isLoaded) {
      setAddressSuggestions([]);
      setIsSearching(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsSearching(true);
      
      const options = {
        input: searchQuery,
        componentRestrictions: { country: 'au' },
        types: ['address']
      };
      
      autocompleteService.getPlacePredictions(
        options,
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: string) => {
          setIsSearching(false);
          
          if (status !== 'OK' || !predictions || predictions.length === 0) {
            setAddressSuggestions([]);
            return;
          }
          
          const results = predictions.map((prediction) => ({
            place_id: prediction.place_id,
            formatted_address: prediction.description,
            name: prediction.structured_formatting?.main_text || prediction.description
          }));
          
          setAddressSuggestions(results);
        }
      );
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, autocompleteService, isLoaded]);

  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('address', query);
    setSearchQuery(query);
    
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };
  
  const handleSelectAddress = (prediction: PlaceResult) => {
    if (!placesService || !prediction.place_id) {
      form.setValue('address', prediction.formatted_address || '');
      setAddressSuggestions([]);
      return;
    }
    
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
        
        const addressComponents = handlePlaceDetails(place, prediction, form);
        if (addressComponents) {
          setShowManualFields(true);
        }
        
        setAddressSuggestions([]);
      }
    );
  };
  
  const toggleManualFields = () => {
    setShowManualFields(!showManualFields);
  };

  return {
    showManualFields,
    addressSuggestions,
    isSearching,
    handleAddressSearch,
    handleSelectAddress,
    toggleManualFields
  };
}
