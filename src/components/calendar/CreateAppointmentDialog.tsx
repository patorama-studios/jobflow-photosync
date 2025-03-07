
import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';

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
  const isMobile = useIsMobile();
  
  // Format the date safely - handle potential invalid date errors
  const formattedDate = selectedDate ? format(selectedDate, "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
  const initialAppointmentTime = selectedTime || "11:00 AM";
  
  const [appointmentDate, setAppointmentDate] = useState<string>(
    `${formattedDate} ${initialAppointmentTime}`
  );

  // Update appointment date when selectedDate or selectedTime changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM dd, yyyy");
      const time = selectedTime || initialAppointmentTime;
      setAppointmentDate(`${formattedDate} ${time}`);
      console.log("Updated appointment date:", `${formattedDate} ${time}`);
    }
  }, [selectedDate, selectedTime, initialAppointmentTime]);

  const handleCreateAppointment = () => {
    // In a real app, this would save the appointment
    console.log("Creating appointment with date:", appointmentDate);
    toast.success("Appointment created successfully!");
    onClose();
  };

  // Get Google Maps API key from environment or use a default one for development
  // Note: In production, this should be loaded from an environment variable
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDcwGyRxRbcNGWOFQVT87A1xkbTuoiRRwE";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-2xl p-0 gap-0 ${isMobile ? 'h-[85vh]' : 'h-[90vh]'} flex flex-col overflow-hidden`}>
        <DialogHeader className="px-6 py-4 flex flex-row justify-between items-center border-b shrink-0">
          <DialogTitle className="text-xl">Create Appointment</DialogTitle>
          <div className="flex items-center">
            <Button variant="ghost" className="text-primary">Switch to Block</Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <GoogleMapsProvider apiKey={googleMapsApiKey} defaultRegion="au">
          <div className="flex-1 overflow-y-auto p-4">
            <OrderDetailsForm />
          </div>
        </GoogleMapsProvider>
        
        <DialogFooter className="px-6 py-4 border-t mt-auto shrink-0">
          <Button variant="outline" onClick={onClose} className="mr-2">Close</Button>
          <Button onClick={handleCreateAppointment}>Create Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
