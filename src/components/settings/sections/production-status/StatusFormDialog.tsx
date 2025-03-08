
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductionStatus, StatusFormData } from './types';

interface StatusFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StatusFormData;
  editingStatus: ProductionStatus | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function StatusFormDialog({
  open,
  onOpenChange,
  formData,
  editingStatus,
  onInputChange,
  onCheckboxChange,
  onSubmit
}: StatusFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? 'Edit Status' : 'Add New Status'}
            </DialogTitle>
            <DialogDescription>
              {editingStatus
                ? 'Update the production status details below.'
                : 'Fill in the details for the new production status.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Status Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={onInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  id="colorHex"
                  name="color"
                  value={formData.color}
                  onChange={onInputChange}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isDefault"
                name="is_default"
                checked={formData.is_default}
                onCheckedChange={onCheckboxChange}
              />
              <Label htmlFor="isDefault">
                Set as default status for new tasks
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingStatus ? 'Save Changes' : 'Add Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
