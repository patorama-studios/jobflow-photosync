
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';

interface PropertySectionHeaderProps {
  showManualFields: boolean;
  toggleManualFields: () => void;
}

export const PropertySectionHeader: React.FC<PropertySectionHeaderProps> = ({
  showManualFields,
  toggleManualFields
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <div className="flex-1">
        <FormLabel>Address</FormLabel>
      </div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={toggleManualFields}
      >
        {showManualFields ? "Hide Manual" : "Add Manually"}
      </Button>
    </div>
  );
};
