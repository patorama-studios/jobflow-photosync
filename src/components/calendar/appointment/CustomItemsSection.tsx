
import React from 'react';
import { Button } from '@/components/ui/button';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface CustomItemsSectionProps {
  customItems: CustomItem[];
  openAddItemDialog: () => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  customItems,
  openAddItemDialog
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Custom Items</p>
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary"
          onClick={openAddItemDialog}
        >
          Add Custom Item
        </Button>
      </div>
      
      {customItems.length > 0 ? (
        <div className="space-y-2">
          {customItems.map(item => (
            <div key={item.id} className="flex justify-between p-2 bg-muted/30 rounded">
              <p>{item.name}</p>
              <p className="font-medium">${item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No custom items added.</p>
      )}
    </div>
  );
};
