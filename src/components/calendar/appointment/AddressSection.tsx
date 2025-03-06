
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoogleAddressAutocomplete } from '@/components/ui/google-address-autocomplete';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { isLoaded } = useGoogleMaps();
  const isMobile = useIsMobile();

  return (
    <div>
      <p className="text-sm font-medium mb-2">Address</p>
      <p className="text-sm text-muted-foreground mb-1">Search Address</p>
      
      {isLoaded ? (
        <GoogleAddressAutocomplete 
          onAddressSelect={onAddressSelect}
          placeholder="Search an address..." 
        />
      ) : (
        <div className="relative">
          <Input placeholder="Loading Google Maps..." disabled className="pl-9" />
        </div>
      )}
      
      {addressDetails.formattedAddress && (
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
