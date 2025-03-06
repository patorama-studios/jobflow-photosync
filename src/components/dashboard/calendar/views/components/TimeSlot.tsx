
import React, { memo } from 'react';

interface TimeSlotProps {
  hour: number;
  onTimeSlotClick?: (time: string) => void;
  onDrop: (hour: number) => void;
}

export const TimeSlot = memo(({ 
  hour, 
  onTimeSlotClick,
  onDrop
}: TimeSlotProps) => {
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
    onDrop(hour);
  };

  return (
    <div 
      className="flex border-t border-gray-200 relative hover:bg-accent/30 cursor-pointer transition-colors"
      style={{ height: '60px' }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-hour={hour}
    >
      <div className="w-16 text-xs text-gray-500 -mt-2.5">{hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}</div>
      <div className="flex-1"></div>
    </div>
  );
});

TimeSlot.displayName = 'TimeSlot';
