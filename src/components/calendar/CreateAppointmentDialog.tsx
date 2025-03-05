
import React, { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderDetailsForm } from './appointment/OrderDetailsForm';
import { AppointmentDetailsForm } from './appointment/AppointmentDetailsForm';

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime?: string;
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime
}) => {
  const [appointmentDate, setAppointmentDate] = useState<string>(
    format(selectedDate, "MMM dd, yyyy") + (selectedTime ? ` ${selectedTime}` : " 11:00 AM")
  );

  const handleCreateAppointment = () => {
    // In a real app, this would save the appointment
    console.log("Creating appointment");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 flex flex-row justify-between items-center border-b">
          <DialogTitle className="text-xl">Create Appointment</DialogTitle>
          <div className="flex items-center">
            <Button variant="ghost" className="text-primary">Switch to Block</Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <OrderDetailsForm />
          
          {/* Right Column - Appointment Details */}
          <AppointmentDetailsForm 
            appointmentDate={appointmentDate}
            setAppointmentDate={setAppointmentDate}
          />
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose} className="mr-2">Close</Button>
          <Button onClick={handleCreateAppointment}>Create Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
