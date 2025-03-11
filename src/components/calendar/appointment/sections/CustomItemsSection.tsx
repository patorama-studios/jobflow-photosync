
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { CustomItem } from '@/hooks/use-create-appointment-form';

interface CustomItemsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  items: CustomItem[];
  onAddItem: (item: CustomItem) => void;
  onRemoveItem: (id: string) => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  isOpen,
  onToggle,
  items,
  onAddItem,
  onRemoveItem
}) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    if (itemName && itemPrice) {
      onAddItem({
        id: Date.now().toString(), // Generate a unique ID
        name: itemName,
        price: parseFloat(itemPrice)
      });
      setItemName('');
      setItemPrice('');
    }
  };

  return (
    <ToggleSection 
      title="Custom Items" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Price"
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-24"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              disabled={!itemName || !itemPrice}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="border rounded-md p-4 space-y-2">
            <h4 className="text-sm font-medium">Added Items</h4>
            <div className="divide-y">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToggleSection>
  );
};
