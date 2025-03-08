
import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CalendarViews } from '@/components/calendar/CalendarViews';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, parse, addDays } from 'date-fns';

// Define enum for event types to replace the missing import
enum EventTypes {
  APPOINTMENT = 'appointment',
  BLOCK = 'block'
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('day');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  
  // Set the selected time based on the current time
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes() >= 30 ? 30 : 0;
    
    // Format to "10:30 AM" style
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute === 0 ? '00' : minute} ${amPm}`;
  });
  
  // Fetch calendar events from Supabase
  const { data: calendarEvents, isLoading, error } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      // In a real app, we'd fetch from the database
      try {
        // Updated to use 'orders' table instead of non-existent 'calendar_events'
        const { data, error } = await supabase
          .from('orders')
          .select('*');
        
        if (error) throw error;
        
        // Transform orders data to calendar event format
        return (data || []).map(order => ({
          id: order.id,
          title: order.package || 'Photography Order',
          start: order.scheduled_date,
          end: order.scheduled_date, // Add 1.5 hours to end time in a real implementation
          type: EventTypes.APPOINTMENT,
          orderId: order.id,
          location: `${order.address}, ${order.city}, ${order.state}`,
          notes: order.notes || ''
        }));
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        // Return mock data if supabase table doesn't exist yet
        return [
          {
            id: 1,
            title: 'Professional Photography',
            start: format(new Date(), 'yyyy-MM-dd') + ' 10:00:00',
            end: format(new Date(), 'yyyy-MM-dd') + ' 11:30:00',
            type: EventTypes.APPOINTMENT,
            orderId: '123',
            location: '123 Main St, Anytown, CA',
            notes: 'Customer requested exterior shots first'
          },
          {
            id: 2,
            title: 'Video Tour',
            start: format(addDays(new Date(), 1), 'yyyy-MM-dd') + ' 14:00:00',
            end: format(addDays(new Date(), 1), 'yyyy-MM-dd') + ' 16:00:00',
            type: EventTypes.APPOINTMENT,
            orderId: '124',
            location: '456 Oak Ave, Sometown, NY',
            notes: 'Bring extra lighting equipment'
          },
          {
            id: 3,
            title: 'Lunch Break',
            start: format(new Date(), 'yyyy-MM-dd') + ' 12:00:00',
            end: format(new Date(), 'yyyy-MM-dd') + ' 13:00:00',
            type: EventTypes.BLOCK,
            notes: 'Personal time'
          }
        ];
      }
    }
  });
  
  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  // Handle date cell click
  const handleDateCellClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    if (time) {
      setSelectedTime(time);
    }
    setIsAppointmentDialogOpen(true);
  };
  
  // Handle navigate to a different date
  const handleNavigate = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Close the event dialog
  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Close the appointment dialog
  const handleCloseAppointmentDialog = () => {
    setIsAppointmentDialogOpen(false);
  };
  
  return (
    <PageTransition>
      <SidebarLayout>
        <div className="container mx-auto">
          <CalendarViews 
            calendarEvents={calendarEvents || []} // Updated prop name to calendarEvents
            selectedDate={selectedDate}
            selectedView={selectedView}
            onViewChange={setSelectedView}
            onNavigate={handleNavigate}
            onEventClick={handleEventClick}
            onDateCellClick={handleDateCellClick}
            isLoading={isLoading}
          />
          
          {/* Event Details Dialog */}
          {selectedEvent && (
            <EventDetailsDialog 
              open={isEventDialogOpen} // Updated prop name to open
              onOpenChange={() => setIsEventDialogOpen(false)} // Updated to use onOpenChange
              event={selectedEvent}
            />
          )}
          
          {/* Create Appointment Dialog */}
          <CreateAppointmentDialog 
            isOpen={isAppointmentDialogOpen}
            onClose={handleCloseAppointmentDialog}
            selectedDate={selectedDate}
            initialTime={selectedTime}
          />
        </div>
      </SidebarLayout>
    </PageTransition>
  );
};

export default CalendarPage;
