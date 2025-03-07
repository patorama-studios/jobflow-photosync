import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CalendarEvent } from '@/types/calendar';
import { useEventActions } from '@/hooks/use-calendar-state';

// Initialize the localizer
const localizer = momentLocalizer(moment);

interface GoogleCalendarProps {
  events: CalendarEvent[];
  view: string;
  date: Date;
  onNavigate: (date: Date) => void;
  onView: (view: string) => void;
  onSelectEvent: (event: CalendarEvent, e: React.SyntheticEvent) => void;
  onDoubleClickEvent: (event: CalendarEvent, e: React.SyntheticEvent) => void;
  // Add any other props as needed
}

export const GoogleCalendar: React.FC<GoogleCalendarProps> = ({
  events,
  view,
  date,
  onNavigate,
  onView,
  onSelectEvent,
  onDoubleClickEvent,
}) => {
  const { rescheduleEvent } = useEventActions();

  // Other code and logic

  return (
    <div className="h-full">
      <Calendar
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view as any}
        date={date}
        onNavigate={onNavigate}
        onView={onView as any}
        onSelectEvent={(event, e) => {
          if (typeof onSelectEvent === 'function') {
            onSelectEvent(event as CalendarEvent, e);
          }
        }}
        onDoubleClickEvent={(event, e) => {
          if (typeof onDoubleClickEvent === 'function') {
            onDoubleClickEvent(event as CalendarEvent, e);
          }
        }}
        // Other calendar props
      />
    </div>
  );
};
