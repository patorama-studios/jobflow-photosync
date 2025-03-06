
import React, { memo } from 'react';

interface WeekTimeSlotProps { 
  date: Date;
  hour: number;
  colIndex: number;
  onTimeSlotClick?: (time: string) => void;
  onDrop: (date: Date, hour: number) => void;
}

export const WeekTimeSlot = memo(({ 
  date,
  hour,
  colIndex,
  onTimeSlotClick,
  onDrop
}: WeekTimeSlotProps) => {
  const handleClick = () => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(date, hour);
  };

  return (
    <div 
      className="p-1 border-t border-gray-200 h-16 hover:bg-accent/30 cursor-pointer transition-colors relative"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-hour={hour}
      data-col={colIndex}
    />
  );
});

WeekTimeSlot.displayName = 'WeekTimeSlot';
