
import React, { Fragment, memo } from 'react';
import { format } from 'date-fns';
import { WeekTimeSlot } from './WeekTimeSlot';

interface WeekGridProps {
  dates: Date[];
  hours: number[];
  onTimeSlotClick?: (time: string) => void;
  onDrop: (date: Date, hour: number) => void;
}

export const WeekGrid = memo(({ 
  dates,
  hours,
  onTimeSlotClick,
  onDrop
}: WeekGridProps) => {
  return (
    <div className="grid grid-cols-8 gap-1">
      <div className="h-14 flex items-end pb-2">
        <span className="text-xs text-muted-foreground">Time</span>
      </div>
      
      {dates.map(date => (
        <div key={date.toISOString()} className="h-14 flex flex-col items-center justify-end pb-2">
          <div className="text-sm font-medium">{format(date, 'EEE')}</div>
          <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
        </div>
      ))}
      
      {hours.map(hour => (
        <Fragment key={hour}>
          <div className="text-xs text-muted-foreground h-16 flex items-center">
            {hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}
          </div>
          
          {dates.map((date, colIndex) => (
            <WeekTimeSlot 
              key={`${date.toISOString()}-${hour}`}
              date={date}
              hour={hour}
              colIndex={colIndex}
              onTimeSlotClick={onTimeSlotClick}
              onDrop={onDrop}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
});

WeekGrid.displayName = 'WeekGrid';
