
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoogleAddressAutocomplete } from '@/components/ui/google-address-autocomplete';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { toast } from 'sonner';

interface AddressDetails {
  formattedAddress: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

interface GoogleMapsInputProps {
  addressDetails: {
    formattedAddress: string;
  };
  onAddressSelect: (address: AddressDetails) => void;
}

export const GoogleMapsInput: React.FC<GoogleMapsInputProps> = ({ 
  addressDetails, 
  onAddressSelect 
}) => {
  const { isLoaded, error, retryLoading } = useGoogleMaps();
  
  // Handle address selection from Google Maps
  const handleAddressSelect = (address: AddressDetails) => {
    // Call the parent's onAddressSelect with the address
    onAddressSelect(address);
    
    // Log the result for debugging
    console.log("Address selected:", address);
    
    // Show a success message
    if (address.formattedAddress) {
      toast.success("Address loaded successfully");
    }
  };

  return (
    <>
      {isLoaded ? (
        <div className="mb-2">
          <GoogleAddressAutocomplete 
            value={addressDetails.formattedAddress}
            onChange={(value) => {
              // This will be called when the input changes
              console.log("Input changed:", value);
            }}
            onSelect={(address) => {
              // This will be called when an address is selected
              handleAddressSelect(address as AddressDetails);
            }}
            placeholder="Search an address..." 
            className="w-full"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Input 
              placeholder={error ? "Google Maps not available, enter manually" : "Loading Google Maps..."} 
              disabled={!error} 
              className="pl-9" 
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {error && (
            <div className="text-sm text-destructive">
              Google Maps API could not be loaded. Please enter address manually.
              <button 
                onClick={retryLoading}
                className="ml-2 text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          )}
          {!error && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Loading Google Maps...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
