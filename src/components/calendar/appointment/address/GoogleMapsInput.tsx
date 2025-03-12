
import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { extractAddressComponents } from '@/lib/address-utils';
import { AddressDetails } from '@/hooks/google-maps/types';

interface GoogleMapsInputProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  placeholder?: string;
}

export const GoogleMapsInput: React.FC<GoogleMapsInputProps> = ({ 
  onAddressSelect,
  placeholder = "Search for an address..."
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load the Google Maps script if it's not already loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setIsLoading(true);
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoading(false);
        initAutocomplete();
      };
      
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
    
    return () => {
      // Clean up
    };
  }, []);
  
  const initAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'au' },
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['address']
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      
      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();
      
      if (place.address_components) {
        const addressComponents = extractAddressComponents(place.address_components);
        
        const addressDetails: AddressDetails = {
          ...addressComponents,
          formatted_address: place.formatted_address
        };
        
        onAddressSelect(addressDetails);
      }
    });
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      
      {isLoading ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
