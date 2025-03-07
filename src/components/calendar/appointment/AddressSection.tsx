
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoogleAddressAutocomplete } from '@/components/ui/google-address-autocomplete';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface AddressDetails {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

interface AddressSectionProps {
  addressDetails: AddressDetails;
  onAddressSelect: (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ 
  addressDetails, 
  onAddressSelect 
}) => {
  const { isLoaded, error } = useGoogleMaps();
  const isMobile = useIsMobile();
  const [manualEntry, setManualEntry] = useState<boolean>(false);
  
  const handleManualAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Create a partial object with just the updated field
    const updatedField = { [name]: value };
    
    // Pass the updated address to parent, maintaining other values
    onAddressSelect({
      formattedAddress: name === 'streetAddress' ? 
        `${value}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.postalCode}` : 
        addressDetails.formattedAddress,
      streetAddress: name === 'streetAddress' ? value : addressDetails.streetAddress,
      city: name === 'city' ? value : addressDetails.city,
      state: name === 'state' ? value : addressDetails.state,
      postalCode: name === 'postalCode' ? value : addressDetails.postalCode,
      country: 'Australia', // Default to Australia
      lat: addressDetails.lat || 0,
      lng: addressDetails.lng || 0,
      ...updatedField
    });
  };

  // Use useEffect to handle setting manualEntry when there's an error
  useEffect(() => {
    if (error) {
      setManualEntry(true);
    }
  }, [error]);

  return (
    <div>
      <p className="text-sm font-medium mb-2">Address</p>
      <p className="text-sm text-muted-foreground mb-1">Search Address</p>
      
      {isLoaded ? (
        <>
          <GoogleAddressAutocomplete 
            onAddressSelect={onAddressSelect}
            placeholder="Search an address..." 
            defaultValue={addressDetails.formattedAddress}
          />
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setManualEntry(!manualEntry)}
              className="text-xs text-primary hover:underline"
            >
              {manualEntry ? "Use address search" : "Enter address manually"}
            </button>
          </div>
        </>
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
            </div>
          )}
        </div>
      )}
      
      {/* Manual address entry form */}
      {manualEntry && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Street Address</p>
            <Input
              name="streetAddress"
              value={addressDetails.streetAddress || ''}
              onChange={handleManualAddressInput}
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium mb-1">City</p>
              <Input
                name="city"
                value={addressDetails.city || ''}
                onChange={handleManualAddressInput}
                placeholder="City"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">State</p>
              <Input
                name="state"
                value={addressDetails.state || ''}
                onChange={handleManualAddressInput}
                placeholder="State"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Postal Code</p>
            <Input
              name="postalCode"
              value={addressDetails.postalCode || ''}
              onChange={handleManualAddressInput}
              placeholder="Postal Code"
            />
          </div>
        </div>
      )}
      
      {addressDetails.formattedAddress && !manualEntry && (
        <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
          <p className="font-medium">{addressDetails.formattedAddress}</p>
          {addressDetails.streetAddress && (
            <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-2 gap-2'} mt-2`}>
              <div>
                <p className="text-xs text-muted-foreground">Street</p>
                <p>{addressDetails.streetAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p>{addressDetails.city}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">State</p>
                <p>{addressDetails.state}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Postal Code</p>
                <p>{addressDetails.postalCode}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
