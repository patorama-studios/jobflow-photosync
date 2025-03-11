
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { TimeSelector } from '../TimeSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, MapPin, Clock } from 'lucide-react';
import { SchedulingAssistant } from './SchedulingAssistant';

interface SchedulingSectionProps {
  date: Date;
  time: string;
  address: string;
  photographer?: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  lat?: number;
  lng?: number;
}

export const SchedulingSection: React.FC<SchedulingSectionProps> = ({
  date,
  time,
  address,
  photographer,
  onDateChange,
  onTimeChange,
  lat,
  lng
}) => {
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [showSuggestedTimes, setShowSuggestedTimes] = useState(false);
  
  // Generate suggested times based on a standard set of times
  useEffect(() => {
    const generateTimes = () => {
      const times = [];
      
      // Morning times
      for (let hour = 8; hour <= 11; hour++) {
        times.push(`${hour}:00 AM`);
        times.push(`${hour}:30 AM`);
      }
      
      // Noon
      times.push('12:00 PM');
      times.push('12:30 PM');
      
      // Afternoon times
      for (let hour = 1; hour <= 5; hour++) {
        times.push(`${hour}:00 PM`);
        times.push(`${hour}:30 PM`);
      }
      
      return times;
    };
    
    setSuggestedTimes(generateTimes());
  }, []);

  const handleTimeSelect = (selectedTime: string) => {
    onTimeChange(selectedTime);
    setShowSuggestedTimes(false);
  };

  // Modified for building a structured appointment time
  const getReadableDateTime = () => {
    if (!date) return '';
    
    const formattedDate = format(date, 'EEEE, MMMM do, yyyy');
    return `${formattedDate} at ${time}`;
  };

  return (
    <div className="space-y-4 py-2 border-t border-gray-100">
      <div className="flex items-start gap-2">
        <div className="mt-1">
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Appointment Time</p>
          <p className="text-sm text-gray-500">{getReadableDateTime()}</p>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && onDateChange(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="relative">
              <div 
                className="flex items-center border rounded-md overflow-hidden"
                onClick={() => setShowSuggestedTimes(!showSuggestedTimes)}
              >
                <Input
                  type="text"
                  placeholder="Select time"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="h-full rounded-none border-l"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Time selector now properly receives selectedTime prop */}
              {showSuggestedTimes && (
                <TimeSelector
                  value={time}
                  onChange={handleTimeSelect}
                  suggestedTimes={suggestedTimes}
                />
              )}
            </div>
          </div>
          
          {address && (
            <div className="mt-3">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{address}</span>
              </div>
            </div>
          )}
          
          {address && lat && lng && (
            <div className="mt-3">
              <SchedulingAssistant
                address={address}
                date={date}
                photographer={photographer}
                lat={lat}
                lng={lng}
                onSuggestedTimeSelect={handleTimeSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
