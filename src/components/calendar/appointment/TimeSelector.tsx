
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  suggestedTimes: string[];
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  suggestedTimes
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
      <ScrollArea className="h-60">
        <div className="p-2 space-y-1">
          {suggestedTimes.map((time) => (
            <Button
              key={time}
              type="button"
              variant={value === time ? 'default' : 'ghost'}
              className="w-full justify-start text-left"
              onClick={() => onChange(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
