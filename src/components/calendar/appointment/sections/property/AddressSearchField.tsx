
import React, { useRef, useEffect, useState } from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AddressSearchFieldProps {
  form: UseFormReturn<any>;
}

// Get Google Maps API key from localStorage or environment variable
const getGoogleMapsApiKey = () => {
  return localStorage.getItem('google_maps_api_key') || 
         process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 
         process.env.VITE_GOOGLE_MAPS_API_KEY;
};

export const AddressSearchField: React.FC<AddressSearchFieldProps> = ({
  form
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [googleMapsError, setGoogleMapsError] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const initializeGooglePlaces = () => {
    if (!inputRef.current || !window.google?.maps?.places) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          // Update the form field with the selected address
          form.setValue('address', place.formatted_address);
          
          // Parse address components and populate other fields
          if (place.address_components) {
            const addressComponents = place.address_components;
            let city = '';
            let state = '';
            let zip = '';

            addressComponents.forEach((component) => {
              const types = component.types;
              if (types.includes('locality')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.short_name;
              } else if (types.includes('postal_code')) {
                zip = component.long_name;
              }
            });

            // Update form fields if they exist
            if (city) form.setValue('city', city);
            if (state) form.setValue('state', state);
            if (zip) form.setValue('zip', zip);
          }

          console.log('🔧 Address selected:', place.formatted_address);
        }
      });
    } catch (error) {
      console.error('🔧 Error initializing Google Places autocomplete:', error);
      setGoogleMapsError(true);
    }
  };

  useEffect(() => {
    // Get the API key
    const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();
    
    // Update hasApiKey state
    setHasApiKey(!!GOOGLE_MAPS_API_KEY);
    
    // Skip Google Maps initialization if no API key is configured
    if (!GOOGLE_MAPS_API_KEY) {
      console.log('🔧 No Google Maps API key configured, using fallback address input');
      return;
    }

    // Listen for Google Maps API errors
    const handleGoogleMapsError = () => {
      console.error('🔧 Google Maps API key error detected');
      setGoogleMapsError(true);
    };

    // Set up global error handler for Google Maps
    window.gm_authFailure = handleGoogleMapsError;

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initializeGooglePlaces();
    } else {
      // Load Google Maps API if not already loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      
      if (!existingScript) {
        console.log('🔧 Loading Google Maps API for address autocomplete');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
        script.async = true;
        script.onload = () => {
          console.log('🔧 Google Maps API loaded successfully');
          initializeGooglePlaces();
        };
        script.onerror = () => {
          console.error('🔧 Failed to load Google Maps API');
          setGoogleMapsError(true);
        };
        document.head.appendChild(script);
      } else {
        // Script exists but may not be loaded yet
        const checkGoogleMaps = () => {
          if (window.google?.maps?.places) {
            initializeGooglePlaces();
          } else {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
      }
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {googleMapsError || !hasApiKey ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <FormControl>
              <Input 
                {...field}
                ref={(el) => {
                  inputRef.current = el;
                  field.ref(el);
                }}
                placeholder={
                  googleMapsError || !hasApiKey 
                    ? "Enter property address manually..." 
                    : "Start typing an address..."
                } 
                className="pl-10"
                autoComplete="off"
              />
            </FormControl>
          </div>
          {(googleMapsError || !hasApiKey) && (
            <p className="text-xs text-yellow-600 mt-1">
              📍 Address autocomplete unavailable - please enter address manually
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
