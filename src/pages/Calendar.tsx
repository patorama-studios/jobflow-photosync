
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarViews } from '@/components/calendar/CalendarViews';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import PageLoading from '@/components/loading/PageLoading';
import { supabase } from '@/integrations/supabase/client';

export type EventTypes = 'standard' | 'premium' | 'urgent' | 'blocked' | 'rescheduled' | 'pending';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");

  // Fetch calendar events from Supabase
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      // Fetch events from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Map database orders to calendar events
      return data.map(order => ({
        id: order.id.toString(),
        title: `${order.client} - ${order.property_type}`,
        start: `${order.scheduled_date}T${order.scheduled_time.replace(/\s/g, '')}`,
        end: `${order.scheduled_date}T${order.scheduled_time.replace(/\s/g, '')}`,
        type: (order.status as EventTypes) || 'standard',
        orderId: order.order_number,
        location: `${order.address}, ${order.city}, ${order.state}`,
        notes: order.notes || '',
        order: order // Include the full order data
      }));
    },
  });

  const handleViewChange = (newView: 'day' | 'week' | 'month') => {
    setView(newView);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setIsEventDetailsOpen(false);
    setSelectedEvent(null);
  };

  const handleTimeSlotClick = (date: Date, time?: string) => {
    setSelectedTimeSlot(date);
    if (time) {
      setSelectedTime(time);
    }
    setIsCreateAppointmentOpen(true);
  };

  const handleCloseCreateAppointment = () => {
    setIsCreateAppointmentOpen(false);
  };

  const handleAppointmentAdded = async () => {
    // Refetch events to update the calendar
    await refetch();
    return true;
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="container mx-auto py-8">
      <CalendarHeader
        date={currentDate}
        view={view}
        appointmentCount={events?.length || 0}
        onPrevious={() => console.log('Previous')}
        onNext={() => console.log('Next')}
        onToday={() => setCurrentDate(new Date())}
        onViewChange={handleViewChange}
        onAddEvent={() => handleTimeSlotClick(new Date())}
      />
      
      <CalendarViews
        date={currentDate}
        view={view}
        onEventClick={handleEventClick}
        onTimeSlotClick={handleTimeSlotClick}
        onViewChange={handleViewChange}
        events={events || []}
        isLoading={isLoading}
      />
      
      <EventDetailsDialog
        isOpen={isEventDetailsOpen}
        onClose={handleCloseEventDetails}
        event={selectedEvent}
      />
      
      <CreateAppointmentDialog
        isOpen={isCreateAppointmentOpen}
        onClose={handleCloseCreateAppointment}
        selectedDate={selectedTimeSlot}
        initialTime={selectedTime}
        onAppointmentAdded={handleAppointmentAdded}
      />
    </div>
  );
};

export default Calendar;
