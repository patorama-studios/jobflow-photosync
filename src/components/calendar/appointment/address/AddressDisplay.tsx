
import React from 'react';

export interface AddressDisplayProps {
  address: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({ address }) => {
  return (
    <div className="p-3 bg-muted rounded-md">
      <p className="font-medium text-sm">{address}</p>
    </div>
  );
};
