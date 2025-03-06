
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddCustomItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: {
    name: string;
    price: number;
  };
  setNewItem: React.Dispatch<React.SetStateAction<{
    name: string;
    price: number;
  }>>;
  handleAddCustomItem: () => void;
}

export const AddCustomItemDialog: React.FC<AddCustomItemDialogProps> = ({
  open,
  onOpenChange,
  newItem,
  setNewItem,
  handleAddCustomItem
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%]' : 'sm:max-w-[425px]'}`}>
        <DialogHeader>
          <DialogTitle>Add Custom Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input 
              id="itemName" 
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="itemPrice">Price</Label>
            <Input 
              id="itemPrice" 
              type="number"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
            />
          </div>
        </div>
        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className={isMobile ? "w-full" : ""}>Cancel</Button>
          <Button onClick={handleAddCustomItem} className={isMobile ? "w-full" : ""}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
