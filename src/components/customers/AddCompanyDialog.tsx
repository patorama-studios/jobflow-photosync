
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompanyForm } from './company/CompanyForm';

interface AddCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (company: any) => void;
}

export const AddCompanyDialog: React.FC<AddCompanyDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCompanyCreated
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        
        <CompanyForm onClose={onClose} onCompanyCreated={onCompanyCreated} />
      </DialogContent>
    </Dialog>
  );
};
