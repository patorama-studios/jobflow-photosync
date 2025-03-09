import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Order, OrderStatus } from '@/types/order-types';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { useOrders } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-styles.css';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

interface GoogleMonthViewProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export default function GoogleMonthView({ 
  selectedDate, 
  onSelectDate 
}: GoogleMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const { events: googleEvents, isLoading: isLoadingGoogle } = useGoogleCalendar();
  const { orders, isLoading: isLoadingOrders, refetch } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Combine Google events and orders
  const events = useMemo(() => {
    const allEvents = [...(orders || [])];
    
    // Only add Google events if they don't overlap with existing orders
    if (googleEvents) {
      googleEvents.forEach(googleEvent => {
        // Check if this is a Google event (status will be 'unavailable')
        if (googleEvent.status === 'unavailable' as OrderStatus) {
          // Check if there's no existing order at the same time
          const hasOverlap = allEvents.some(order => 
            order.scheduledDate === googleEvent.scheduledDate && 
            order.scheduledTime === googleEvent.scheduledTime
          );
          
          if (!hasOverlap) {
            allEvents.push(googleEvent);
          }
        }
      });
    }
    
    return allEvents;
  }, [orders, googleEvents]);

  // Convert orders to calendar events
  const calendarEvents = useMemo(() => {
    return events.map(event => {
      const startDate = new Date(event.scheduledDate);
      const [hours, minutes] = event.scheduledTime.split(':');
      startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      // End time is 1 hour after start time by default
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      
      return {
        id: event.id,
        title: `${event.client} - ${event.address}`,
        start: startDate,
        end: endDate,
        resource: event,
      };
    });
  }, [events]);

  // Handle refreshing the calendar data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Handle date navigation
  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  // Handle event selection
  const handleSelectEvent = (event: any) => {
    console.log('Selected event:', event);
    // You can add navigation to the order details page here
  };

  // Custom event styling based on status
  const eventStyleGetter = (event: any) => {
    const resource = event.resource;
    let backgroundColor = '#3174ad'; // Default blue
    
    if (resource) {
      if (resource.status === 'completed') {
        backgroundColor = '#4caf50'; // Green for completed
      } else if (resource.status === 'canceled' || resource.status === 'cancelled') {
        backgroundColor = '#f44336'; // Red for canceled
      } else if (resource.status === 'pending') {
        backgroundColor = '#ff9800'; // Orange for pending
      } else if (resource.status === 'unavailable') {
        backgroundColor = '#9e9e9e'; // Grey for Google events
      }
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Loading state
  if (isLoadingOrders || isLoadingGoogle) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Calendar View
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="calendar-wrapper" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onNavigate={handleNavigate}
          date={currentDate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          tooltipAccessor={(event) => event.title}
        />
      </div>
    </div>
  );
}
