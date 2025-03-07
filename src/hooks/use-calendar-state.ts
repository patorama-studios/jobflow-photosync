
import { useState, useRef } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Order } from '@/types/order-types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function useCalendarState() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
  const handleSelectSlot = ({ start }: { start: Date }, onTimeSlotClick?: (time: string) => void, onDayClick?: (date: Date) => void) => {
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

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    popoverPosition,
    isPopoverOpen,
    setIsPopoverOpen,
    date,
    setDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    calendarRef,
    handleSelectEvent,
    handleSelectSlot,
    handleEditEvent,
    handleDeleteEvent,
    handleDateChange
  };
}
