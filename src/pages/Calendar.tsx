
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarViews } from '@/components/calendar/CalendarViews';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';

type CalendarView = 'day' | 'week' | 'month';

const CalendarPage = () => {
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState<string | undefined>();
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch events from Supabase
  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('scheduled_date', { ascending: true });
        
        if (error) throw error;
        
        return data.map(order => ({
          id: order.id,
          title: order.client || 'Unnamed Order',
          start: new Date(`${order.scheduled_date} ${order.scheduled_time}`),
          end: new Date(new Date(`${order.scheduled_date} ${order.scheduled_time}`).getTime() + 60 * 60 * 1000),
          resourceId: order.photographer || 'unassigned',
          status: order.status,
          address: order.address,
          city: order.city,
          state: order.state,
          orderData: order
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load calendar events');
        return [];
      }
    }
  });

  // Memoize the organized events to prevent unnecessary recalculations
  const organizedEvents = useMemo(() => events || [], [events]);

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
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
    setSelectedDate(date);
    setSelectedAppointmentTime(time);
    setIsNewAppointmentOpen(true);
  };

  const handleCloseAppointmentDialog = () => {
    setIsNewAppointmentOpen(false);
  };

  const handleAppointmentAdded = async () => {
    // Refetch events when a new appointment is added
    return true;
  };

  return (
    <div className="container mx-auto py-8">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={view}
        setViewMode={handleViewChange}
        handlePrevious={() => console.log('Previous')}
        handleNext={() => console.log('Next')}
        handleToday={() => setCurrentDate(new Date())}
        getDateRangeTitle={() => format(currentDate, 'MMMM yyyy')}
        showCalendarSubmenu={false}
        setShowCalendarSubmenu={() => {}}
      />
      
      <CalendarViews
        date={currentDate}
        view={view}
        onEventClick={handleEventClick}
        onTimeSlotClick={handleTimeSlotClick}
        onViewChange={handleViewChange}
        events={organizedEvents}
        isLoading={isLoading}
      />
      
      <EventDetailsDialog
        selectedEvent={selectedEvent}
        showEventDetails={isEventDetailsOpen}
        setShowEventDetails={setIsEventDetailsOpen}
      />
      
      <CreateAppointmentDialog
        isOpen={isNewAppointmentOpen}
        onClose={handleCloseAppointmentDialog}
        selectedDate={selectedDate}
        initialTime={selectedAppointmentTime}
        onAppointmentAdded={handleAppointmentAdded}
      />
    </div>
  );
};

const Calendar = () => {
  return (
    <MainLayout>
      <CalendarPage />
    </MainLayout>
  );
};

export default Calendar;
