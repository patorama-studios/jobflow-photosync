
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AppointmentDetailsFormProps {
  appointmentDate: string;
  setAppointmentDate: (date: string) => void;
}

export const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  appointmentDate,
  setAppointmentDate
}) => {
  console.log("AppointmentDetailsForm received date:", appointmentDate);
  
  // Parse date parts from the appointmentDate string
  const dateParts = appointmentDate.split(' ');
  const timeStr = dateParts.length > 2 ? dateParts.slice(-2).join(' ') : "11:00 AM";
  const dateStr = dateParts.length > 2 ? dateParts.slice(0, -2).join(' ') : dateParts[0];
  
  // Initialize state with parsed values
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error("Error parsing date:", dateStr);
      return new Date();
    }
  });
  
  const [selectedTime, setSelectedTime] = useState<string>(timeStr || "11:00 AM");

  // Update parent state when local state changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM dd, yyyy");
      setAppointmentDate(`${formattedDate} ${selectedTime}`);
    }
  }, [selectedDate, selectedTime, setAppointmentDate]);

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

  // Generate time options in 45-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 17; hour++) {
      const hourStr = hour > 12 ? (hour - 12) : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      
      // Add hour on the hour
      options.push(`${hourStr}:00 ${amPm}`);
      
      // Add 45 minutes past the hour (except for the last hour)
      if (hour < 17) {
        options.push(`${hourStr}:45 ${amPm}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Appointment Date</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Select 
            value={selectedTime} 
            onValueChange={handleTimeChange}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select defaultValue="45">
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="135">2.25 hours</SelectItem>
              <SelectItem value="180">3 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea placeholder="Add any notes about this appointment..." className="h-24" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notifyClient">Client Notification</Label>
          <Select defaultValue="email">
            <SelectTrigger>
              <SelectValue placeholder="Select notification method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No notification</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="both">Email & SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Suggested Dates</h3>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((_, i) => (
              <Button 
                key={i}
                variant="outline" 
                className="justify-start text-left"
                onClick={() => handleDateChange(addDays(new Date(), i + 1))}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(addDays(new Date(), i + 1), "EEEE, MMM d")} at 11:00 AM
              </Button>
            ))}
          </div>
        </div>
      
    </div>
  );
};
