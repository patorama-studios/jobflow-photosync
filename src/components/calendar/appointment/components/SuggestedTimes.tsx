
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, addHours, isAfter, isBefore, setHours, setMinutes, addDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface SuggestedTimesProps {
  selectedDate: Date | undefined;
  onTimeSelect: (time: string) => void;
}

export const SuggestedTimes: React.FC<SuggestedTimesProps> = ({
  selectedDate,
  onTimeSelect
}) => {
  const [suggestedTimes, setSuggestedTimes] = useState<{ date: Date; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = (baseDate: Date): { date: Date; time: string }[] => {
    if (!baseDate) return [];

    const times: { date: Date; time: string }[] = [];
    
    // Generate for today and next 3 days
    for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
      const date = addDays(baseDate, dayOffset);
      const startTime = setHours(setMinutes(date, 0), 9); // 9 AM
      const endTime = setHours(setMinutes(date, 0), 17); // 5 PM
      
      let currentTime = startTime;
      
      while (isBefore(currentTime, endTime)) {
        times.push({ 
          date: new Date(currentTime),
          time: format(currentTime, 'h:mm a') 
        });
        // Add 30 minutes
        currentTime = addHours(currentTime, 0.5);
      }
    }
    
    return times;
  };

  const checkAvailability = async (baseDate: Date, timeSlots: { date: Date; time: string }[]): Promise<{ date: Date; time: string }[]> => {
    if (!baseDate || timeSlots.length === 0) return [];
    
    try {
      // Get all scheduled appointments
      const { data: existingAppointments, error } = await supabase
        .from('orders')
        .select('scheduled_date, scheduled_time');
      
      if (error) {
        console.error('Error checking availability:', error);
        return timeSlots;
      }
      
      // Map of date -> array of booked times
      const bookedSlots = new Map<string, string[]>();
      
      if (existingAppointments) {
        existingAppointments.forEach(app => {
          const dateStr = app.scheduled_date ? format(new Date(app.scheduled_date), 'yyyy-MM-dd') : '';
          if (!bookedSlots.has(dateStr)) {
            bookedSlots.set(dateStr, []);
          }
          
          if (app.scheduled_time) {
            bookedSlots.get(dateStr)?.push(app.scheduled_time);
          }
        });
      }
      
      // Filter out booked slots
      const availableSlots = timeSlots.filter(slot => {
        const dateStr = format(slot.date, 'yyyy-MM-dd');
        const bookedTimesForDate = bookedSlots.get(dateStr) || [];
        return !bookedTimesForDate.includes(slot.time);
      });
      
      // Return a subset of available slots to make the list more manageable
      // Return 2 slots per day for 3 days = 6 slots
      const selectedSlots: { date: Date; time: string }[] = [];
      const daysToShow = 3;
      const slotsPerDay = 2;
      
      for (let i = 0; i < daysToShow; i++) {
        const day = addDays(baseDate, i);
        const dayStr = format(day, 'yyyy-MM-dd');
        
        // Get slots for this day
        const daySlots = availableSlots.filter(slot => 
          format(slot.date, 'yyyy-MM-dd') === dayStr
        );
        
        // Space them out throughout the day
        if (daySlots.length > 0) {
          const morningSlot = daySlots.find(slot => {
            const hour = new Date(slot.date).getHours();
            return hour >= 9 && hour < 12;
          });
          
          const afternoonSlot = daySlots.find(slot => {
            const hour = new Date(slot.date).getHours();
            return hour >= 13 && hour < 17;
          });
          
          if (morningSlot) selectedSlots.push(morningSlot);
          if (afternoonSlot) selectedSlots.push(afternoonSlot);
          
          // If we couldn't find morning/afternoon slots, just add what we have
          if (!morningSlot && !afternoonSlot && daySlots.length > 0) {
            selectedSlots.push(...daySlots.slice(0, slotsPerDay));
          }
        }
      }
      
      return selectedSlots;
    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  };

  useEffect(() => {
    const getSuggestedTimes = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      try {
        const allTimeSlots = generateTimeSlots(selectedDate);
        const availableSlots = await checkAvailability(selectedDate, allTimeSlots);
        setSuggestedTimes(availableSlots);
      } catch (error) {
        console.error('Error getting suggested times:', error);
        setSuggestedTimes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSuggestedTimes();
  }, [selectedDate]);

  const handleSlotSelect = (date: Date, time: string) => {
    // Update the selected date
    onTimeSelect(time);
  };

  if (isLoading) {
    return (
      <div className="mt-2">
        <div className="text-sm font-medium mb-2">Suggested Times</div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    );
  }

  if (suggestedTimes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="text-sm font-medium mb-2">Suggested Times</div>
      <div className="flex flex-wrap gap-2">
        {suggestedTimes.map((slot, index) => (
          <Button
            key={`${format(slot.date, 'yyyy-MM-dd')}-${slot.time}-${index}`}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSlotSelect(slot.date, slot.time)}
            className="px-3 py-1 h-8 text-xs"
          >
            {format(slot.date, 'EEE, MMM d')} at {slot.time}
          </Button>
        ))}
      </div>
    </div>
  );
};
