
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface SuggestedDatesProps {
  onDateSelect: (date: Date) => void;
}

export const SuggestedDates: React.FC<SuggestedDatesProps> = ({ onDateSelect }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Suggested Dates</h3>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((_, i) => (
          <Button 
            key={i}
            variant="outline" 
            className="justify-start text-left"
            onClick={() => onDateSelect(addDays(new Date(), i + 1))}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(addDays(new Date(), i + 1), "EEEE, MMM d")} at 11:00 AM
          </Button>
        ))}
      </div>
    </div>
  );
};
