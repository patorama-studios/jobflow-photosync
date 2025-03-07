
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CalendarEvent } from '@/types/calendar';
import { CalendarEventComponent } from '../components/CalendarEventComponent';
import { TimeSlotWrapper } from '../components/TimeSlotWrapper';
import { CalendarToolbar } from '../CalendarToolbar';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

interface CalendarWeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date }) => void;
}

export function CalendarWeekView({ 
  date,
  events,
  onSelectEvent,
  onSelectSlot
}: CalendarWeekViewProps) {
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
      view="week"
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
