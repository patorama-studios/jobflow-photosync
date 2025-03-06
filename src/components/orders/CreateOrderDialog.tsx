
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrderDialog({ open, onOpenChange }: CreateOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-4xl">
        <CreateAppointmentDialog
          isOpen={open}
          onClose={() => onOpenChange(false)}
          selectedDate={new Date()}
        />
      </DialogContent>
    </Dialog>
  );
}
