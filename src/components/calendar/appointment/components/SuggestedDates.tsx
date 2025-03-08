
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface SuggestedDatesProps {
  onDateSelect: (date: Date) => void;
}

export const SuggestedDates: React.FC<SuggestedDatesProps> = ({ onDateSelect }) => {
  // Generate suggested dates (next 3 days)
  const suggestedDates = [
    addDays(new Date(), 1),
    addDays(new Date(), 2),
    addDays(new Date(), 3)
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Suggested Dates</h3>
      <div className="flex flex-col gap-2">
        {suggestedDates.map((date, i) => (
          <Button 
            key={i}
            variant="outline" 
            className="justify-start text-left"
            onClick={() => onDateSelect(date)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "EEEE, MMM d")} at 11:00 AM
          </Button>
        ))}
      </div>
    </div>
  );
};
