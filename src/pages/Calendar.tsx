
import React, { useState, useMemo } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarViews } from '@/components/calendar/CalendarViews';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
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
  const [selectedView, setSelectedView] = useState('month');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [initialTime, setInitialTime] = useState<string | undefined>(undefined);
  
  // Fetch calendar events
  const { data: calendarEvents, isLoading } = useQuery({
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
            title: 'Real Estate Photography',
            start: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
            end: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
            type: EventTypes.APPOINTMENT,
            orderId: 'ORD-12345',
            location: '123 Main St, Austin, TX',
            notes: 'Corner property, park across the street'
          },
          {
            id: 2,
            title: 'Commercial Property Shoot',
            start: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
            end: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
            type: EventTypes.APPOINTMENT,
            orderId: 'ORD-23456',
            location: '456 Business Ave, Austin, TX',
            notes: 'Use loading dock entrance'
          }
        ];
      }
    }
  });
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCreateDialogOpen(true);
  };
  
  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };
  
  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  const handleCreateAppointment = (time?: string) => {
    setInitialTime(time);
    setIsCreateDialogOpen(true);
  };
  
  const handleTimeSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setInitialTime(time);
    setIsCreateDialogOpen(true);
  };
  
  return (
    <PageTransition>
      <SidebarLayout>
        <div className="container mx-auto">
          <CalendarViews 
            events={calendarEvents || []}
            selectedDate={selectedDate}
            selectedView={selectedView}
            onViewChange={setSelectedView}
            onDateSelect={handleDateSelect}
            onEventSelect={handleEventSelect}
            onTimeSlotSelect={handleTimeSlotSelect}
            isLoading={isLoading}
          />
          
          {/* Event Details Dialog */}
          {selectedEvent && (
            <EventDetailsDialog 
              isOpen={isEventDialogOpen}
              onClose={handleCloseEventDialog}
              event={selectedEvent}
            />
          )}
          
          {/* Create Appointment Dialog */}
          <CreateAppointmentDialog
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            selectedDate={selectedDate}
            initialTime={initialTime}
          />
        </div>
      </SidebarLayout>
    </PageTransition>
  );
};

export default CalendarPage;
