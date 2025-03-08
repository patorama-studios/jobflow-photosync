
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, addHours, isAfter, isBefore, setHours, setMinutes } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface SuggestedTimesProps {
  selectedDate: Date | undefined;
  onTimeSelect: (time: string) => void;
}

export const SuggestedTimes: React.FC<SuggestedTimesProps> = ({
  selectedDate,
  onTimeSelect
}) => {
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = (date: Date): string[] => {
    if (!date) return [];

    const times: string[] = [];
    const startTime = setHours(setMinutes(date, 0), 9); // 9 AM
    const endTime = setHours(setMinutes(date, 0), 17); // 5 PM
    
    let currentTime = startTime;
    
    while (isBefore(currentTime, endTime)) {
      times.push(format(currentTime, 'h:mm a'));
      // Add 30 minutes
      currentTime = addHours(currentTime, 0.5);
    }
    
    return times;
  };

  const checkAvailability = async (date: Date, timeSlots: string[]): Promise<string[]> => {
    if (!date || timeSlots.length === 0) return [];
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Check existing appointments for this date
      const { data: existingAppointments, error } = await supabase
        .from('orders')
        .select('scheduled_time')
        .eq('scheduled_date', dateStr);
      
      if (error) {
        console.error('Error checking availability:', error);
        return timeSlots;
      }
      
      // Get booked times
      const bookedTimes = existingAppointments?.map(app => app.scheduled_time) || [];
      
      // Filter out booked times
      const availableTimes = timeSlots.filter(time => !bookedTimes.includes(time));
      
      // Return a subset of available times (e.g., every hour) to make suggestion list shorter
      return availableTimes.filter((_, index) => index % 4 === 0).slice(0, 5);
    } catch (error) {
      console.error('Error checking availability:', error);
      return timeSlots;
    }
  };

  useEffect(() => {
    const getSuggestedTimes = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      const allTimeSlots = generateTimeSlots(selectedDate);
      const availableTimes = await checkAvailability(selectedDate, allTimeSlots);
      setSuggestedTimes(availableTimes);
      setIsLoading(false);
    };
    
    getSuggestedTimes();
  }, [selectedDate]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-2">Loading suggested times...</div>;
  }

  if (suggestedTimes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="text-sm font-medium mb-2">Suggested Times</div>
      <div className="flex flex-wrap gap-2">
        {suggestedTimes.map((time) => (
          <Button
            key={time}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onTimeSelect(time)}
            className="px-3 py-1 h-8 text-xs"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};
