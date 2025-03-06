
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface DeleteOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

// Use memo to prevent unnecessary re-renders
export const DeleteOrderDialog = memo(function DeleteOrderDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirmDelete 
}: DeleteOrderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
