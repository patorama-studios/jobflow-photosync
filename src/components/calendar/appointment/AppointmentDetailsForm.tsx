
import React, { useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(appointmentDate.split(' ')[0])
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    appointmentDate.split(' ').slice(1).join(' ') || "11:00 AM"
  );

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

  return (
    <div className="p-6 border-l md:border-l">
      <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>
      
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
                <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                <SelectItem value="5:00 PM">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select defaultValue="60">
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
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
    </div>
  );
};
