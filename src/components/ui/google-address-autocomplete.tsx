
import React, { useRef, useEffect, useState } from 'react';
import { Input } from './input';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleAddressAutocompleteProps {
  onAddressSelect?: (place: any) => void;
  className?: string;
  placeholder?: string;
}

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  onAddressSelect,
  className,
  placeholder = "Search for an address..."
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setIsLoading(true);
      
      // Load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDof5HeiGV-WBmXrPJrEtcSr0ZPKiEhHqI&libraries=places`;
      script.async = true;
      script.onload = () => {
        setIsLoading(false);
        initializeAutocomplete();
      };
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (onAddressSelect && place) {
          onAddressSelect(place);
        }
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Input
        ref={inputRef}
        className={cn("pl-10 pr-10", className)}
        placeholder={placeholder}
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
