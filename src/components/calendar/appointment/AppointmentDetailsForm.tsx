
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ChevronDown, Clock, CalendarIcon } from 'lucide-react';
import { DurationSelector } from './DurationSelector';
import { cn } from '@/lib/utils';
import { TimeSelector } from './TimeSelector';

interface AppointmentDetailsFormProps {
  form: any;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
}

export const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  form,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  selectedDuration,
  onDurationChange
}) => {
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  
  // Generate formatted time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 17; hour++) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const hourStr = displayHour.toString();
      const amPm = isPM ? 'PM' : 'AM';
      
      // Add hour on the hour
      options.push(`${hourStr}:00 ${amPm}`);
      
      // Add 30 minutes past the hour
      options.push(`${hourStr}:30 ${amPm}`);
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="scheduledDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateChange(date);
                      field.onChange(date);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="scheduledTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time</FormLabel>
            <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className="w-full pl-3 text-left font-normal"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {selectedTime || "Select time"}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="relative">
                  <Input
                    placeholder="Search time..."
                    value={selectedTime}
                    onChange={(e) => {
                      onTimeChange(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    className="w-full border-0 focus:ring-0"
                  />
                  <TimeSelector
                    value={selectedTime}
                    onChange={(time) => {
                      onTimeChange(time);
                      field.onChange(time);
                      setTimePopoverOpen(false);
                    }}
                    suggestedTimes={timeOptions}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <DurationSelector
                value={selectedDuration}
                onChange={(duration) => {
                  onDurationChange(duration);
                  field.onChange(duration);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
