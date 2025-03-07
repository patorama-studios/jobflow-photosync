
import React, { useState, useEffect } from 'react';
import { format, parse, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  className?: string;
  suggestedTimes?: string[];
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeChange,
  className,
  suggestedTimes = []
}) => {
  const [timeValue, setTimeValue] = useState(selectedTime || '9:00 AM');
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
    
    // Try to parse the time
    try {
      const parsedTime = parse(e.target.value, 'h:mm a', new Date());
      
      if (!isNaN(parsedTime.getTime())) {
        const formattedTime = format(parsedTime, 'h:mm a');
        onTimeChange(formattedTime);
      }
    } catch (error) {
      // Invalid time format, don't update the selection
      console.log('Invalid time format:', e.target.value);
    }
  };
  
  // Generate time slots in 15-minute increments
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // Start at 8:00 AM
    
    // Generate slots from 8:00 AM to 8:00 PM
    for (let i = 0; i < 49; i++) { // 12 hours * 4 slots per hour + 1
      const time = addMinutes(startTime, i * 15);
      const timeString = format(time, 'h:mm a');
      slots.push(timeString);
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Update the timeValue when selectedTime prop changes
  useEffect(() => {
    if (selectedTime && selectedTime !== timeValue) {
      setTimeValue(selectedTime);
    }
  }, [selectedTime]);
  
  const handleTimeSelect = (time: string) => {
    setTimeValue(time);
    onTimeChange(time);
    setIsOpen(false);
  };
  
  const timeIsInTimeSlots = (time: string): boolean => {
    return timeSlots.includes(time);
  };
  
  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={timeValue}
              onChange={handleInputChange}
              placeholder="Select time"
              className="pl-9"
            />
            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <div className="p-2 border-b">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">Select Time</h4>
              {!timeIsInTimeSlots(timeValue) && (
                <div className="text-xs text-muted-foreground">
                  Custom: {timeValue}
                </div>
              )}
            </div>
            
            {suggestedTimes.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Suggested Times:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedTimes.map((time, index) => (
                    <Button
                      key={`suggested-${index}`}
                      variant="outline"
                      size="sm"
                      className="text-xs py-1 h-6"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <ScrollArea className="h-60">
            <div className="grid grid-cols-2 gap-1 p-2">
              {timeSlots.map((time, index) => (
                <Button
                  key={index}
                  variant={time === timeValue ? "default" : "ghost"}
                  className="justify-start text-left font-normal"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};
