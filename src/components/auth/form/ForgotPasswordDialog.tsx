
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from '../ForgotPasswordForm';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
        </DialogHeader>
        <ForgotPasswordForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
