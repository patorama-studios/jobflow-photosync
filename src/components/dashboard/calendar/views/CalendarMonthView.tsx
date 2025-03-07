
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CalendarEvent } from '@/types/calendar';
import { CalendarEventComponent } from '../components/CalendarEventComponent';
import { TimeSlotWrapper } from '../components/TimeSlotWrapper';
import { CalendarToolbar } from '../CalendarToolbar';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

interface CalendarMonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date }) => void;
  onDateChange: (date: Date) => void;
  viewMode: string;
  onViewModeChange: (view: string) => void;
}

export function CalendarMonthView({ 
  date,
  events,
  onSelectEvent,
  onSelectSlot,
  onDateChange,
  viewMode,
  onViewModeChange
}: CalendarMonthViewProps) {
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%' }}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      selectable
      components={{
        event: CalendarEventComponent,
        timeSlotWrapper: TimeSlotWrapper,
        toolbar: CalendarToolbar,
      }}
      date={date}
      onNavigate={onDateChange}
      view={viewMode}
      onView={onViewModeChange}
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: event.color,
        },
      })}
      dayPropGetter={(date) => {
        const today = new Date();
        return {
          className: date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
            ? 'rbc-today'
            : '',
        };
      }}
    />
  );
}
