
import React from 'react';
import { AddressMap } from './AddressMap';

interface AddressDisplayProps {
  addressDetails: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    lat: number;
    lng: number;
  };
  isMobile: boolean;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  addressDetails,
  isMobile
}) => {
  if (!addressDetails.formattedAddress) return null;
  
  return (
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
      
      {/* Add map display when we have coordinates */}
      {addressDetails.lat && addressDetails.lng && (
        <AddressMap 
          lat={addressDetails.lat} 
          lng={addressDetails.lng} 
          address={addressDetails.formattedAddress} 
        />
      )}
    </div>
  );
};
