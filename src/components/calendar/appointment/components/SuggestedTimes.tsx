
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { Clock } from 'lucide-react';

interface SuggestedTimesProps {
  selectedDate?: Date;
  onTimeSelect: (time: string) => void;
}

export const SuggestedTimes: React.FC<SuggestedTimesProps> = ({ 
  selectedDate, 
  onTimeSelect 
}) => {
  // Generate 5 suggested date+time combinations within the week
  const suggestedDateTimes = useMemo(() => {
    const result = [];
    const baseDate = selectedDate || new Date();
    
    // Standard business hours
    const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];
    
    // Generate today's slots if before 5 PM
    const now = new Date();
    const currentHour = now.getHours();
    
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const date = addDays(baseDate, dayOffset);
      const dateStr = format(date, 'EEE, MMM d');
      
      // Add one time slot for each day
      const timeIndex = dayOffset % timeSlots.length;
      const time = timeSlots[timeIndex];
      
      // Skip times in the past for today
      if (dayOffset === 0 && isToday(date)) {
        const timeHour = time.includes('PM') 
          ? (parseInt(time.split(':')[0]) + (time.split(':')[0] === '12' ? 0 : 12))
          : (time.split(':')[0] === '12' ? 0 : parseInt(time.split(':')[0]));
          
        if (timeHour <= currentHour) continue;
      }
      
      let label = '';
      if (isToday(date)) {
        label = `Today at ${time}`;
      } else if (isTomorrow(date)) {
        label = `Tomorrow at ${time}`;
      } else {
        label = `${dateStr} at ${time}`;
      }
      
      result.push({
        date,
        time,
        label
      });
    }
    
    // Ensure we have exactly 5 suggestions by adding more from the following days if needed
    let additionalDayOffset = 5;
    while (result.length < 5) {
      const date = addDays(baseDate, additionalDayOffset);
      const dateStr = format(date, 'EEE, MMM d');
      const time = timeSlots[additionalDayOffset % timeSlots.length];
      const label = `${dateStr} at ${time}`;
      
      result.push({
        date,
        time,
        label
      });
      
      additionalDayOffset++;
    }
    
    // Only return the first 5 suggestions
    return result.slice(0, 5);
  }, [selectedDate]);

  const handleTimeClick = (suggestion: { date: Date, time: string, label: string }) => {
    onTimeSelect(suggestion.time);
    // Set the date in the parent component (in a real implementation, you'd want to update both)
  };

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium mb-2">Suggested Times</h4>
      <ScrollArea className="h-36 w-full">
        <div className="flex flex-col gap-2 pb-1">
          {suggestedDateTimes.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleTimeClick(suggestion)}
              className="justify-start text-left"
            >
              <Clock className="mr-2 h-4 w-4" />
              {suggestion.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
