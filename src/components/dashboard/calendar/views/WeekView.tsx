
import React, { memo } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format } from 'date-fns';
import { Timer, MapPin } from 'lucide-react';

interface WeekViewProps {
  dates: Date[];
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

const WeekTimeSlot = memo(({ 
  date,
  hour,
  onTimeSlotClick 
}: { 
  date: Date;
  hour: number;
  onTimeSlotClick?: (time: string) => void;
}) => {
  const handleClick = () => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  };

  return (
    <div 
      className="p-1 border-t border-gray-200 h-8 hover:bg-accent/30 cursor-pointer transition-colors"
      onClick={handleClick}
    ></div>
  );
});

WeekTimeSlot.displayName = 'WeekTimeSlot';

export const WeekView = memo(({ dates, orders, onTimeSlotClick }: WeekViewProps) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <div className="week-view overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
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
          <React.Fragment key={hour}>
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              {hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}
            </div>
            
            {dates.map(date => (
              <WeekTimeSlot 
                key={`${date.toISOString()}-${hour}`}
                date={date}
                hour={hour}
                onTimeSlotClick={onTimeSlotClick}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

WeekView.displayName = 'WeekView';
