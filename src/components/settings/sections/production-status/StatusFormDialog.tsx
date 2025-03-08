
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProductionStatus, StatusFormData } from './types';

interface StatusFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StatusFormData;
  editingStatus: ProductionStatus | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStatus ? 'Edit Production Status' : 'Add Production Status'}
          </DialogTitle>
          <DialogDescription>
            {editingStatus 
              ? 'Update the details for this production status' 
              : 'Create a new status for production tasks'}
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
              placeholder="e.g., In Progress" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="color" 
                name="color" 
                type="color" 
                value={formData.color} 
                onChange={onInputChange} 
                className="w-16 h-10 p-1"
              />
              <Input 
                name="color" 
                value={formData.color} 
                onChange={onInputChange}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={onInputChange}
              placeholder="Describe what this status means"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="isDefault" 
              name="isDefault" 
              checked={formData.isDefault} 
              onChange={onCheckboxChange} 
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Set as default status
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingStatus ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
