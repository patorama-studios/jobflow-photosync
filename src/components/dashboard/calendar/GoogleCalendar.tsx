
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Order } from '@/types/order-types';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarEventPopover } from './CalendarEventPopover';
import { Button } from '@/components/ui/button';
import { useCalendarState } from '@/hooks/use-calendar-state';
import { CalendarEventComponent } from './components/CalendarEventComponent';
import { TimeSlotWrapper } from './components/TimeSlotWrapper';
import { DatePickerButton } from './components/DatePickerButton';
import { convertOrdersToEvents, convertOrdersToTypedOrders } from '@/utils/calendar-event-converter';

// Define the props for the GoogleCalendar component
interface GoogleCalendarProps {
  selectedPhotographers?: number[];
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: "month" | "week" | "day" | "card";
  isMobileView?: boolean;
}

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

export function GoogleCalendar({ 
  selectedPhotographers = [], 
  onTimeSlotClick,
  onDayClick,
  defaultView = "month",
  isMobileView = false
}: GoogleCalendarProps) {
  const { orders } = useSampleOrders();
  const calendarState = useCalendarState();
  const { 
    events, setEvents, 
    selectedEvent, 
    popoverPosition, 
    isPopoverOpen, setIsPopoverOpen,
    date, 
    isDatePickerOpen, setIsDatePickerOpen,
    calendarRef,
    handleSelectEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleDateChange
  } = calendarState;

  // Convert orders to calendar events
  useEffect(() => {
    const calendarEvents = convertOrdersToEvents(orders);
    setEvents(calendarEvents);
  }, [orders, setEvents]);

  // Filter events based on selected photographers
  const filteredEvents = selectedPhotographers.length > 0
    ? events.filter((event) => selectedPhotographers.includes(event.photographerId))
    : events;

  // Handle slot selection (clicking on an empty time slot)
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    calendarState.handleSelectSlot(slotInfo, onTimeSlotClick, onDayClick);
  };

  // Get the filtered orders for the selected date
  const typedOrders = convertOrdersToTypedOrders(orders);
  const filteredOrders = typedOrders.filter(order => {
    const orderDate = new Date(order.scheduledDate);
    return orderDate.toDateString() === date.toDateString();
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <DatePickerButton
            date={date}
            isOpen={isDatePickerOpen}
            onOpenChange={setIsDatePickerOpen}
            onDateChange={handleDateChange}
          />
        </div>
      </div>

      <div className="flex-1 relative" ref={calendarRef}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          components={{
            event: CalendarEventComponent,
            timeSlotWrapper: TimeSlotWrapper,
            toolbar: CalendarToolbar,
          }}
          date={date}
          onNavigate={calendarState.setDate}
          defaultView={defaultView}
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

        {isPopoverOpen && selectedEvent && (
          <div
            className="absolute z-50"
            style={{
              left: `${popoverPosition.left}px`,
              top: `${popoverPosition.top}px`,
            }}
          >
            <CalendarEventPopover
              event={selectedEvent}
              onClose={() => setIsPopoverOpen(false)}
              onEdit={() => handleEditEvent(selectedEvent)}
              onDelete={() => handleDeleteEvent(selectedEvent)}
              orders={filteredOrders}
            />
          </div>
        )}
      </div>
    </div>
  );
}
