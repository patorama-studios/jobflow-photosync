
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CalendarEvent } from '@/types/calendar';
import { useEventActions } from '@/hooks/use-calendar-state';

// Initialize the localizer
const localizer = momentLocalizer(moment);

interface GoogleCalendarProps {
  events?: CalendarEvent[];
  view?: string;
  date?: Date;
  onNavigate?: (date: Date) => void;
  onView?: (view: string) => void;
  onSelectEvent?: (event: CalendarEvent, e: React.SyntheticEvent) => void;
  onDoubleClickEvent?: (event: CalendarEvent, e: React.SyntheticEvent) => void;
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: string;
  isMobileView?: boolean;
}

export const GoogleCalendar: React.FC<GoogleCalendarProps> = ({
  events = [],
  view = 'month',
  date = new Date(),
  onNavigate,
  onView,
  onSelectEvent,
  onDoubleClickEvent,
  onTimeSlotClick,
  onDayClick,
  defaultView,
  isMobileView,
}) => {
  const { rescheduleEvent } = useEventActions();

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (onTimeSlotClick) {
      const formattedTime = moment(start).format('h:mm a');
      onTimeSlotClick(formattedTime);
    }
    
    if (onDayClick) {
      onDayClick(start);
    }
  };

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
        onNavigate={onNavigate || (() => {})}
        onView={(view) => onView?.(view)}
        onSelectEvent={(event, e) => onSelectEvent?.(event as CalendarEvent, e)}
        onDoubleClickEvent={(event, e) => onDoubleClickEvent?.(event as CalendarEvent, e)}
        onSelectSlot={handleSelectSlot}
        defaultView={defaultView || 'month'}
      />
    </div>
  );
};
