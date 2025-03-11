
import React from 'react';
import { Button } from '@/components/ui/button';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface SuggestedTimesProps {
  selectedDate: Date | undefined;
  onTimeSelect: (time: string) => void;
}

export const SuggestedTimes: React.FC<SuggestedTimesProps> = ({
  selectedDate,
  onTimeSelect
}) => {
  // Generate 5 suggested date/time combinations
  const getSuggestedDateTimes = () => {
    const suggestions = [];
    const baseDate = selectedDate || new Date();
    
    // Common appointment times
    const timeSlots = [
      { hour: 9, minute: 0 },   // 9:00 AM
      { hour: 11, minute: 0 },  // 11:00 AM
      { hour: 13, minute: 0 },  // 1:00 PM
      { hour: 15, minute: 0 },  // 3:00 PM
      { hour: 17, minute: 0 }   // 5:00 PM
    ];
    
    // Create dates for today and next few days at different times
    for (let i = 0; i < 5; i++) {
      // Determine which day and time to use (cycle through timeSlots)
      const dayOffset = Math.floor(i / timeSlots.length);
      const timeIndex = i % timeSlots.length;
      
      const dateTime = setMinutes(
        setHours(
          addDays(baseDate, dayOffset),
          timeSlots[timeIndex].hour
        ),
        timeSlots[timeIndex].minute
      );
      
      const formattedDateTime = format(dateTime, "EEE, MMM d 'at' h:mm a");
      const formattedTime = format(dateTime, "h:mm a");
      
      suggestions.push({
        display: formattedDateTime,
        time: formattedTime,
        date: dateTime
      });
      
      // Stop once we have 5 suggestions
      if (suggestions.length >= 5) break;
    }
    
    return suggestions;
  };

  const suggestedTimes = getSuggestedDateTimes();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Suggested times based on availability:</p>
      <div className="flex flex-wrap gap-2">
        {suggestedTimes.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onTimeSelect(suggestion.time)}
            className="text-xs"
          >
            {suggestion.display}
          </Button>
        ))}
      </div>
    </div>
  );
};
