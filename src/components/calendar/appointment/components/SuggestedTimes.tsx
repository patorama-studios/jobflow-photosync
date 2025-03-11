
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SuggestedTimesProps {
  selectedDate?: Date;
  onTimeSelect: (time: string) => void;
}

export const SuggestedTimes: React.FC<SuggestedTimesProps> = ({ 
  selectedDate, 
  onTimeSelect 
}) => {
  // Generate suggested times from 8 AM to 6 PM
  const times = useMemo(() => {
    const result = [];
    for (let hour = 8; hour <= 18; hour++) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const hourString = displayHour.toString();
      result.push(`${hourString}:00 ${isPM ? 'PM' : 'AM'}`);
      if (hour < 18) {
        result.push(`${hourString}:30 ${isPM ? 'PM' : 'AM'}`);
      }
    }
    return result;
  }, []);

  const handleTimeClick = (time: string) => {
    onTimeSelect(time);
  };

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium mb-2">Suggested Times</h4>
      <ScrollArea className="h-36 w-full whitespace-nowrap">
        <div className="flex flex-wrap gap-2 pb-1">
          {times.map((time) => (
            <Button
              key={time}
              variant="outline"
              size="sm"
              onClick={() => handleTimeClick(time)}
              className="flex-shrink-0"
            >
              {time}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
