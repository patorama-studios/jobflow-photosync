
import React, { useState, useEffect } from 'react';
import { CalendarHeader } from '@/components/dashboard/calendar/header/CalendarHeader';
import { format, getMonth, getYear, addDays } from 'date-fns';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { CalendarViews, CalendarView } from '@/components/calendar/CalendarViews';
import { useOrders } from '@/hooks/use-orders';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { useLocalStorage } from '@/hooks/use-local-storage'; // Assuming this hook exists
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { Order } from '@/types/order-types';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  
  // Fetch orders from Supabase
  const { orders, isLoading, error, refetchOrders } = useOrders({
    month: getMonth(selectedDate) + 1,
    year: getYear(selectedDate),
  });

  // Close the create appointment dialog
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setSelectedTime(undefined);
  };

  // Handle clicking on a calendar event
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  // Handle clicking on a time slot
  const handleTimeSlotClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedTimeSlot(date);
    setIsCreateDialogOpen(true);
  };

  // Handle changing the calendar view
  const handleViewChange = (newView: CalendarView) => {
    setCalendarView(newView);
  };

  // Handle appointment added callback
  const handleAppointmentAdded = async (appointmentData: any) => {
    await refetchOrders();
    return true;
  };

  // Format orders for the calendar
  const formattedEvents = orders ? mapSupabaseOrdersToOrderType(orders).map((order: Order) => {
    const date = order.scheduled_date || order.scheduledDate;
    const time = order.scheduled_time || order.scheduledTime;
    const dateTime = date && time ? new Date(`${date}T${time}`) : new Date();
    
    return {
      ...order,
      id: order.id,
      title: order.client || 'Untitled',
      start: dateTime,
      end: addDays(dateTime, 1),
    };
  }) : [];

  return (
    <SidebarLayout>
      <div className="container mx-auto px-4 py-8">
        <CalendarHeader 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
          onAddClick={() => setIsCreateDialogOpen(true)}
          onViewChange={handleViewChange} 
          currentView={calendarView}
        />
        
        <div className="mt-6">
          <CalendarViews
            selectedDate={selectedDate}
            currentView={calendarView} 
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onViewChange={handleViewChange}
            events={formattedEvents}
            isLoading={isLoading}
          />
        </div>
        
        {/* Create Appointment Dialog */}
        <CreateAppointmentDialog 
          isOpen={isCreateDialogOpen}
          onClose={handleCloseCreateDialog}
          selectedDate={selectedTimeSlot || selectedDate}
          initialTime={selectedTime}
          onAppointmentAdded={handleAppointmentAdded}
        />
        
        {/* Event Details Dialog */}
        {selectedEvent && (
          <EventDetailsDialog 
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            event={selectedEvent}
            onEventUpdated={refetchOrders}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default CalendarPage;
