
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Order } from '@/types/order-types';

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
  const [timeInputOpen, setTimeInputOpen] = useState(false);
  const [durationInputOpen, setDurationInputOpen] = useState(false);
  const [timeInputValue, setTimeInputValue] = useState(initialTime || "11:00 AM");
  const [durationInputValue, setDurationInputValue] = useState("45 minutes");
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
    setTimeInputValue(time);
    setTimeInputOpen(false);
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM dd, yyyy");
      setAppointmentDate(`${formattedDate} ${time}`);
    }
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
    setDurationInputValue(duration);
    setDurationInputOpen(false);
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
  
  const durationOptions = [
    "45 minutes",
    "1.5 hours",
    "2.25 hours",
    "3 hours"
  ];

  return (
    <div className="space-y-6">
      {/* Suggested Dates - at the top */}
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
      
      <div className="space-y-2">
        <Label htmlFor="date">Appointment Date</Label>
        <div className={isMobile ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-3"}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
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
          
          <div className="relative">
            <Popover open={timeInputOpen} onOpenChange={setTimeInputOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    placeholder="Select time"
                    value={timeInputValue}
                    onChange={(e) => setTimeInputValue(e.target.value)}
                    onClick={() => setTimeInputOpen(true)}
                    className="w-full pr-10"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search time..." />
                  <CommandList>
                    <CommandEmpty>No time found.</CommandEmpty>
                    <CommandGroup>
                      {timeOptions.map((time) => (
                        <CommandItem 
                          key={time} 
                          value={time}
                          onSelect={() => handleTimeChange(time)}
                        >
                          {time}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <div className="relative">
          <Popover open={durationInputOpen} onOpenChange={setDurationInputOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  placeholder="Select duration"
                  value={durationInputValue}
                  onChange={(e) => setDurationInputValue(e.target.value)}
                  onClick={() => setDurationInputOpen(true)}
                  className="w-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search duration..." />
                <CommandList>
                  <CommandEmpty>No duration found.</CommandEmpty>
                  <CommandGroup>
                    {durationOptions.map((duration) => (
                      <CommandItem 
                        key={duration} 
                        value={duration}
                        onSelect={() => handleDurationChange(duration)}
                      >
                        {duration}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea placeholder="Add any notes about this appointment..." className="h-24" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notifyClient">Client Notification</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              Email
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search notification method..." />
              <CommandList>
                <CommandEmpty>No method found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={() => {}}>No notification</CommandItem>
                  <CommandItem onSelect={() => {}}>Email</CommandItem>
                  <CommandItem onSelect={() => {}}>SMS</CommandItem>
                  <CommandItem onSelect={() => {}}>Email & SMS</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Add a submit button when needed */}
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
