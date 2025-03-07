
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { TimeSelector } from '../TimeSelector';
import { format, addHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SchedulingAssistant } from './SchedulingAssistant';
import { checkAddressExistingOrders } from '@/lib/order-duplicate-checker';
import { toast } from 'sonner';

interface SchedulingSectionProps {
  date: Date;
  time: string;
  address: string;
  photographer: string | undefined;
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [existingOrder, setExistingOrder] = useState<{ id: string, date: string } | null>(null);
  
  // Check for existing orders when address changes
  useEffect(() => {
    if (address) {
      const checkExisting = async () => {
        const existing = await checkAddressExistingOrders(address);
        if (existing) {
          setExistingOrder(existing);
          toast.warning(
            <div>
              <p>This address already has an order scheduled!</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                asChild
              >
                <a href={`/orders/${existing.id}`} target="_blank" rel="noopener noreferrer">
                  View Existing Order
                </a>
              </Button>
            </div>,
            {
              duration: 8000,
              id: `duplicate-address-${existing.id}`
            }
          );
        } else {
          setExistingOrder(null);
        }
      };
      
      checkExisting();
    }
  }, [address]);
  
  // Generate default suggested times
  useEffect(() => {
    const defaultSuggested = [
      format(addHours(new Date(date), 9), 'h:mm a'),  // 9 AM
      format(addHours(new Date(date), 13), 'h:mm a'), // 1 PM
      format(addHours(new Date(date), 16), 'h:mm a')  // 4 PM
    ];
    
    setSuggestedTimes(defaultSuggested);
  }, [date]);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsCalendarOpen(false);
    }
  };
  
  const handleSuggestedTimeUpdate = (times: string[]) => {
    if (times && times.length > 0) {
      setSuggestedTimes(times);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date & Time</label>
        
        {existingOrder && (
          <div className="text-sm p-2 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
            ⚠️ Warning: This address already has an order scheduled for {existingOrder.date}
            <div className="mt-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                asChild
              >
                <a href={`/orders/${existingOrder.id}`} target="_blank" rel="noopener noreferrer">
                  View Existing Order
                </a>
              </Button>
            </div>
          </div>
        )}
        
        <div className={`${!isCalendarOpen ? 'grid grid-cols-2 gap-2' : ''}`}>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {!isCalendarOpen && (
            <TimeSelector 
              selectedTime={time}
              onTimeChange={onTimeChange}
              suggestedTimes={suggestedTimes}
            />
          )}
        </div>
      </div>
      
      {address && lat && lng && (
        <SchedulingAssistant
          address={address}
          photographer={photographer}
          onSelectSlot={(newDate, newTime) => {
            onDateChange(newDate);
            onTimeChange(newTime);
          }}
          onSuggestedTimesUpdate={handleSuggestedTimeUpdate}
          lat={lat}
          lng={lng}
        />
      )}
    </div>
  );
};
