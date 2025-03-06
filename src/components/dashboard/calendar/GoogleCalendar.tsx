
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { CalendarEvent } from '@/types/calendar';
import { Order } from '@/types/orders';
import { CalendarToolbar } from './CalendarToolbar';
import { CalendarEventPopover } from './CalendarEventPopover';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as DatePickerCalendar } from '@/components/ui/calendar';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Custom event component for the calendar
const CalendarEventComponent = ({ event }: { event: CalendarEvent }) => {
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

// Custom time slot wrapper to add hover effects
const TimeSlotWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group transition-colors hover:bg-accent/30 h-full">
      {children}
    </div>
  );
};

// Define the props for the GoogleCalendar component
interface GoogleCalendarProps {
  selectedPhotographers?: number[];
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: "month" | "week" | "day" | "card";
  isMobileView?: boolean;
}

export function GoogleCalendar({ 
  selectedPhotographers = [], 
  onTimeSlotClick,
  onDayClick,
  defaultView = "month",
  isMobileView = false
}: GoogleCalendarProps) {
  const { orders } = useSampleOrders();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Convert orders to calendar events
  useEffect(() => {
    // Map photographers to colors
    const photographerColors: Record<string, string> = {};
    const colors = [
      '#3174ad', // Blue
      '#32a852', // Green
      '#a83232', // Red
      '#a87f32', // Orange
      '#7e32a8', // Purple
      '#32a89e', // Teal
    ];

    // Assign colors to photographers
    orders.forEach((order, index) => {
      if (!photographerColors[order.photographer]) {
        photographerColors[order.photographer] = colors[index % colors.length];
      }
    });

    // Convert orders to calendar events
    const calendarEvents = orders.map((order) => {
      const startDate = new Date(order.scheduledDate);
      // Set the hours from the scheduled_time (format: "HH:MM AM/PM")
      const timeMatch = order.scheduledTime.match(/(\d+):(\d+)\s*([AP]M)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();
        
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        startDate.setHours(hours, minutes, 0);
      }
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2); // Assume 2 hour sessions

      return {
        id: order.id,
        title: order.package || "",
        start: startDate,
        end: endDate,
        client: order.client,
        photographer: order.photographer,
        photographerId: orders.findIndex((o) => o.photographer === order.photographer) + 1,
        location: (order.address || "") + ', ' + (order.city || ""),
        status: order.status,
        color: photographerColors[order.photographer],
        orderNumber: order.orderNumber || `ORD-${Math.floor(Math.random() * 10000)}`,
        order: order,
        // Additional properties to match with CalendarEvent type
        scheduledDate: order.scheduledDate,
        scheduledTime: order.scheduledTime,
        package: order.package,
        address: order.address
      };
    });

    setEvents(calendarEvents);
  }, [orders]);

  // Filter events based on selected photographers
  const filteredEvents = selectedPhotographers.length > 0
    ? events.filter((event) => selectedPhotographers.includes(event.photographerId))
    : events;

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent, e: React.SyntheticEvent) => {
    setSelectedEvent(event);
    
    // Calculate position for the popover
    if (e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const calendarRect = calendarRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      
      // Position the popover relative to the calendar container
      setPopoverPosition({
        left: rect.left - calendarRect.left + rect.width / 2,
        top: rect.top - calendarRect.top + rect.height,
      });
      
      setIsPopoverOpen(true);
    }
  };

  // Handle slot selection (clicking on an empty time slot)
  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (onTimeSlotClick) {
      const formattedTime = format(start, 'h:mm a');
      onTimeSlotClick(formattedTime);
    }
    
    if (onDayClick) {
      onDayClick(start);
    } else {
      navigate(`/orders/new?date=${start.toISOString()}`);
    }
  };

  // Handle event editing
  const handleEditEvent = (event: CalendarEvent) => {
    setIsPopoverOpen(false);
    navigate(`/orders/${event.id}`);
  };

  // Handle event deletion
  const handleDeleteEvent = (event: CalendarEvent) => {
    setIsPopoverOpen(false);
    toast({
      title: "Event deleted",
      description: `${event.title} with ${event.client} has been deleted.`,
    });
    // In a real app, you would delete the event from your database here
  };

  // Handle date change from the date picker
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setIsDatePickerOpen(false);
    }
  };

  // Get the filtered orders for the selected date
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.scheduledDate);
    return orderDate.toDateString() === date.toDateString();
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePickerCalendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
          onNavigate={setDate}
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
