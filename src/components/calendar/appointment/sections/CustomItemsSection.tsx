
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface CustomItemsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  items: CustomItem[];
  onAddItem: (item: Omit<CustomItem, 'id'>) => void;
  onRemoveItem?: (id: string) => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  isOpen,
  onToggle,
  items = [],
  onAddItem,
  onRemoveItem
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddItem = () => {
    if (!name) {
      toast.error('Please enter an item name');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    onAddItem({
      name: name,
      price: Number(price)
    });

    // Reset fields
    setName('');
    setPrice('');
    toast.success('Custom item added');
  };

  return (
    <ToggleSection 
      title="Custom Items" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Item Name</FormLabel>
            <Input
              placeholder="Custom service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </FormItem>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddItem}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Custom Item
        </Button>

        {items.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Added Custom Items</h4>
            <div className="border rounded-md divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-3 flex justify-between items-center">
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                    {onRemoveItem && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveItem(item.id)}
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToggleSection>
  );
};
