
import React from 'react';
import { Input } from '@/components/ui/input';

interface ManualAddressFormProps {
  addressDetails: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
  };
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ManualAddressForm: React.FC<ManualAddressFormProps> = ({
  addressDetails,
  onAddressChange
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">Street Address</p>
        <Input
          name="streetAddress"
          value={addressDetails.streetAddress || ''}
          onChange={onAddressChange}
          placeholder="Enter street address"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm font-medium mb-1">City</p>
          <Input
            name="city"
            value={addressDetails.city || ''}
            onChange={onAddressChange}
            placeholder="City"
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">State</p>
          <Input
            name="state"
            value={addressDetails.state || ''}
            onChange={onAddressChange}
            placeholder="State"
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Postal Code</p>
        <Input
          name="postalCode"
          value={addressDetails.postalCode || ''}
          onChange={onAddressChange}
          placeholder="Postal Code"
        />
      </div>
    </div>
  );
};
