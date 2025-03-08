
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface CustomItemsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  items?: CustomItem[];
  onAddItem?: (item: Omit<CustomItem, 'id'>) => void;
  onRemoveItem?: (id: string) => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  isOpen,
  onToggle,
  items = [],
  onAddItem,
  onRemoveItem
}) => {
  return (
    <ToggleSection 
      title="Custom Items" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="p-6 text-center">
        <p className="text-lg font-medium text-muted-foreground">Feature Coming Soon</p>
        <p className="text-sm text-muted-foreground">
          Custom items functionality will be available in a future update.
        </p>
      </div>
    </ToggleSection>
  );
};
