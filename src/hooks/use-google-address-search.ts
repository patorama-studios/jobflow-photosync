
import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

// Define types for Google Maps services
export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  name?: string;
}

export function useGoogleAddressSearch(form: UseFormReturn<any>) {
  const [showManualFields, setShowManualFields] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Define refs for Google Maps services
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize Google Maps Services
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService if it doesn't exist
      if (!dummyDivRef.current) {
        const div = document.createElement('div');
        dummyDivRef.current = div;
      }
      
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
    }
  }, []);

  // Handle address search with Google Places API
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('address', query);
    
    if (query.length < 3 || !autocompleteServiceRef.current) {
      setAddressSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    
    const options = {
      input: query,
      componentRestrictions: { country: 'au' }, // Restrict to Australia
      types: ['address']
    };
    
    autocompleteServiceRef.current.getPlacePredictions(
      options,
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        setIsSearching(false);
        
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setAddressSuggestions([]);
          return;
        }
        
        // Convert predictions to PlaceResult format
        const results = predictions.map((prediction: google.maps.places.AutocompletePrediction) => ({
          place_id: prediction.place_id,
          formatted_address: prediction.description,
          name: prediction.structured_formatting?.main_text || prediction.description
        })) as PlaceResult[];
        
        setAddressSuggestions(results);
      }
    );
  };
  
  const handleSelectAddress = (prediction: PlaceResult) => {
    if (!placesServiceRef.current || !prediction.place_id) {
      form.setValue('address', prediction.formatted_address || '');
      setAddressSuggestions([]);
      return;
    }
    
    // Get place details to extract components like city, state, zip
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['address_components', 'formatted_address']
      },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          form.setValue('address', prediction.formatted_address || '');
          setAddressSuggestions([]);
          return;
        }
        
        // Set the full address
        form.setValue('address', place.formatted_address || prediction.formatted_address || '');
        form.setValue('propertyAddress', place.formatted_address || prediction.formatted_address || '');
        
        // Extract and set address components
        if (place.address_components) {
          let city = '';
          let state = '';
          let zip = '';
          
          for (const component of place.address_components) {
            const types = component.types;
            
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name; // e.g., VIC, NSW
            } else if (types.includes('postal_code')) {
              zip = component.long_name;
            }
          }
          
          form.setValue('city', city);
          form.setValue('state', state);
          form.setValue('zip', zip);
          
          // Show manual fields if we have extracted address components
          if (city || state || zip) {
            setShowManualFields(true);
          }
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
