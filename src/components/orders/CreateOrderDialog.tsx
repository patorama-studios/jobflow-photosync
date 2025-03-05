
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateOrderForm } from './CreateOrderForm';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <CreateOrderForm onComplete={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
