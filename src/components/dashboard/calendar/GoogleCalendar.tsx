
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
import { DayView } from './views/DayView';
import { CardView } from './views/CardView';
import { supabase } from '@/integrations/supabase/client';

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
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "card">(defaultView);
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);

  // Fetch orders from Supabase
  useEffect(() => {
    async function fetchOrdersFromSupabase() {
      try {
        setIsLoadingSupabase(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setSupabaseOrders(data as Order[]);
        }
      } catch (err) {
        console.error('Error fetching orders from Supabase:', err);
        // Fall back to sample orders (already loaded)
      } finally {
        setIsLoadingSupabase(false);
      }
    }
    
    fetchOrdersFromSupabase();
  }, []);

  // Determine which orders to use
  const activeOrders = supabaseOrders.length > 0 ? supabaseOrders : orders;

  // Convert orders to calendar events
  useEffect(() => {
    const calendarEvents = convertOrdersToEvents(activeOrders);
    setEvents(calendarEvents);
  }, [activeOrders, setEvents]);

  // Filter events based on selected photographers
  const filteredEvents = selectedPhotographers.length > 0
    ? events.filter((event) => selectedPhotographers.includes(event.photographerId))
    : events;

  // Handle slot selection (clicking on an empty time slot)
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    calendarState.handleSelectSlot(slotInfo, onTimeSlotClick, onDayClick);
  };

  // Get the filtered orders for the selected date
  const typedOrders = convertOrdersToTypedOrders(activeOrders);
  const filteredOrders = typedOrders.filter(order => {
    // Filter by photographer if needed
    if (selectedPhotographers.length > 0) {
      const photographerMatch = photographers.some(p => 
        selectedPhotographers.includes(p.id) && order.photographer === p.name
      );
      if (!photographerMatch) return false;
    }
    
    // Always filter by date
    const orderDate = new Date(order.scheduledDate);
    return orderDate.toDateString() === date.toDateString();
  });

  // Get photographer names from the events for filtering
  const photographers = Array.from(new Set(events.map(event => ({
    id: event.photographerId,
    name: event.photographer
  })))).filter(p => p.name); // Filter out empty photographer names

  // Render different views based on viewMode
  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return (
          <DayView 
            date={date} 
            orders={activeOrders} 
            onTimeSlotClick={onTimeSlotClick} 
          />
        );
      case 'card':
        return (
          <CardView
            selectedDate={date}
            orders={activeOrders}
            onDayClick={onDayClick}
          />
        );
      default:
        return (
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
            view={viewMode}
            onView={(view) => setViewMode(view as any)}
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
  };

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
        
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            Card
          </Button>
        </div>
      </div>

      <div className="flex-1 relative" ref={calendarRef}>
        {renderCalendarView()}

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
