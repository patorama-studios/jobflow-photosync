
import { useState, useRef, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

// Define types for Google Maps services
export interface PlaceResult {
  place_id?: string;
  formatted_address?: string;
  name?: string;
  address_components?: AddressComponent[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export function useGoogleAddressSearch(form: UseFormReturn<any>) {
  const [showManualFields, setShowManualFields] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Define refs for Google Maps services
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize Google Maps Services
  useEffect(() => {
    // Check if Google Maps script is loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log("Google Maps API is loaded");
      
      // Initialize autocomplete service
      if (!autocompleteServiceRef.current && window.google.maps.places.AutocompleteService) {
        console.log("Initializing AutocompleteService");
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      }
      
      // Create a dummy div for PlacesService if it doesn't exist
      if (!dummyDivRef.current) {
        console.log("Creating dummy div for PlacesService");
        const div = document.createElement('div');
        dummyDivRef.current = div;
      }
      
      // Initialize places service
      if (!placesServiceRef.current && window.google.maps.places.PlacesService && dummyDivRef.current) {
        console.log("Initializing PlacesService");
        placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
      }
    } else {
      console.log("Google Maps API is not loaded yet");
      
      // Load Google Maps script if not already loaded
      if (!document.getElementById('google-maps-script') && !window.google) {
        console.log("Loading Google Maps script");
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        script.onload = () => {
          console.log("Google Maps script loaded successfully");
          
          if (window.google && window.google.maps && window.google.maps.places) {
            // Initialize autocomplete service
            if (window.google.maps.places.AutocompleteService) {
              autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
            }
            
            // Create a dummy div for PlacesService
            if (!dummyDivRef.current) {
              const div = document.createElement('div');
              dummyDivRef.current = div;
            }
            
            // Initialize places service
            if (window.google.maps.places.PlacesService && dummyDivRef.current) {
              placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDivRef.current);
            }
          }
        };
      }
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
    console.log("Searching for address:", query);
    
    const options = {
      input: query,
      componentRestrictions: { country: 'au' }, // Restrict to Australia
      types: ['address']
    };
    
    autocompleteServiceRef.current.getPlacePredictions(
      options,
      (predictions: any[] | null, status: string) => {
        setIsSearching(false);
        console.log("Places API response status:", status);
        
        if (status !== 'OK' || !predictions) {
          console.log("No predictions found or error");
          setAddressSuggestions([]);
          return;
        }
        
        console.log("Got predictions:", predictions);
        
        // Convert predictions to PlaceResult format
        const results = predictions.map((prediction: any) => ({
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
    
    console.log("Selected address:", prediction);
    
    // Get place details to extract components like city, state, zip
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['address_components', 'formatted_address']
      },
      (place: PlaceResult | null, status: string) => {
        console.log("Place details status:", status);
        
        if (status !== 'OK' || !place) {
          console.log("Could not get place details");
          form.setValue('address', prediction.formatted_address || '');
          setAddressSuggestions([]);
          return;
        }
        
        console.log("Got place details:", place);
        
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
          
          console.log("Extracted components:", { city, state, zip });
          
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
