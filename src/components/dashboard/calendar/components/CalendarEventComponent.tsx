
import React from 'react';
import { CalendarEvent } from '@/types/calendar';

interface CalendarEventProps {
  event: CalendarEvent;
}

export const CalendarEventComponent: React.FC<CalendarEventProps> = ({ event }) => {
  return (
    <div
      className="flex flex-col h-full p-1 overflow-hidden text-xs"
      style={{
        backgroundColor: event.color || '#3174ad',
        color: 'white',
        borderRadius: '2px',
      }}
    >
      <div className="font-semibold truncate">{event.title}</div>
      {event.client && <div className="truncate">{event.client}</div>}
    </div>
  );
};
