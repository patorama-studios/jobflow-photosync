
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Clock, CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  isMobile: boolean;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  isMobile
}) => {
  const [timeInputOpen, setTimeInputOpen] = useState(false);
  const [timeInputValue, setTimeInputValue] = useState(selectedTime);

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

  const handleTimeChange = (time: string) => {
    onTimeChange(time);
    setTimeInputValue(time);
    setTimeInputOpen(false);
  };

  return (
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
              onSelect={onDateChange}
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
  );
};
