
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCustomer: {
    name: string;
    email: string;
    company: string;
  };
  setNewCustomer: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    company: string;
  }>>;
  handleCreateCustomer: () => void;
}

export const NewCustomerDialog: React.FC<NewCustomerDialogProps> = ({
  open,
  onOpenChange,
  newCustomer,
  setNewCustomer,
  handleCreateCustomer
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%]' : 'sm:max-w-[425px]'}`}>
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input 
              id="company"
              value={newCustomer.company}
              onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className={isMobile ? "w-full" : ""}>Cancel</Button>
          <Button onClick={handleCreateCustomer} className={isMobile ? "w-full" : ""}>Create Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
