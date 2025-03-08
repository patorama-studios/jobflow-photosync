
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Order } from '@/types/order-types';
import { SuggestedDates } from './components/SuggestedDates';
import { DateTimeSelector } from './components/DateTimeSelector';
import { DurationSelector } from './components/DurationSelector';
import { NotificationSelector } from './components/NotificationSelector';

interface AppointmentDetailsFormProps {
  selectedDate?: Date;
  initialTime?: string;
  defaultOrder?: Order;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

export const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  selectedDate: initialSelectedDate,
  initialTime = "11:00 AM",
  defaultOrder,
  isSubmitting = false,
  onSubmit
}) => {
  const isMobile = useIsMobile();
  
  // Initialize state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialSelectedDate || new Date());
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || "11:00 AM");
  const [selectedDuration, setSelectedDuration] = useState<string>("45 minutes");
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    if (initialSelectedDate) {
      const formattedDate = format(initialSelectedDate, "MMM dd, yyyy");
      return `${formattedDate} ${initialTime}`;
    }
    return format(new Date(), "MMM dd, yyyy") + " " + initialTime;
  });

  // Update appointment date when selectedDate or selectedTime change
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM dd, yyyy");
      setAppointmentDate(`${formattedDate} ${selectedTime}`);
    }
  }, [selectedDate, selectedTime]);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const formattedDate = format(date, "MMM dd, yyyy");
    setAppointmentDate(`${formattedDate} ${selectedTime}`);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM dd, yyyy");
      setAppointmentDate(`${formattedDate} ${time}`);
    }
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  const handleSubmit = () => {
    const data = {
      date: format(selectedDate || new Date(), "yyyy-MM-dd"),
      time: selectedTime,
      duration: selectedDuration,
      // Include order data if available
      ...(defaultOrder && { orderId: defaultOrder.id })
    };
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Suggested Dates */}
      <SuggestedDates onDateSelect={handleDateChange} />
      
      {/* Date Time Selector */}
      <DateTimeSelector
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        isMobile={isMobile}
      />
      
      {/* Duration Selector */}
      <DurationSelector
        selectedDuration={selectedDuration}
        onDurationChange={handleDurationChange}
      />
      
      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea placeholder="Add any notes about this appointment..." className="h-24" />
      </div>
      
      {/* Notification Selector */}
      <NotificationSelector />
      
      {/* Submit Button */}
      {!isSubmitting ? (
        <Button onClick={handleSubmit} className="w-full">
          Schedule Appointment
        </Button>
      ) : (
        <Button disabled className="w-full">
          Scheduling...
        </Button>
      )}
    </div>
  );
};
