
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';

interface CustomItemsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  isOpen,
  onToggle
}) => {
  return (
    <ToggleSection 
      title="Custom Items" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="text-sm text-muted-foreground">
        Custom items functionality will be implemented soon.
      </div>
    </ToggleSection>
  );
};
