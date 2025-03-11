
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeleteOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  orderNumber?: string;
  isDeleting?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirmDelete?: () => Promise<void>;
}

export function DeleteOrderDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  orderNumber = "Unknown",
  isDeleting = false,
  onOpenChange,
  onConfirmDelete
}: DeleteOrderDialogProps) {
  // Handle both onClose and onOpenChange 
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      onClose();
    }
  };

  // Handle the different confirmation callbacks
  const handleConfirm = () => {
    if (onConfirmDelete) {
      onConfirmDelete();
    } else if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete order <span className="font-medium">{orderNumber}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
