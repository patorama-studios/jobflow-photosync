
import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  isSameDay,
  addMonths,
  subMonths,
  isPast
} from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { useIsMobile } from '@/hooks/use-mobile';
import { timeSlots, eventColors } from '@/components/calendar/CalendarUtils';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarViews } from '@/components/calendar/CalendarViews';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';

type ViewMode = 'day' | 'week' | 'month' | 'list';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month'); // Default to month view
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4, 5]);
  const { orders } = useSampleOrders();
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCalendarSubmenu, setShowCalendarSubmenu] = useState(true);
  
  useEffect(() => {
    // On mobile devices, default to the 'list' view
    if (isMobile) {
      setViewMode('list');
    }
  }, [isMobile]);

  const togglePhotographer = (id: number) => {
    setSelectedPhotographers(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  // Create array of photographer objects from orders
  const photographers = Array.from(
    new Set(orders.map(order => order.photographer))
  ).map(name => {
    const id = orders.findIndex(order => order.photographer === name) + 1;
    return { 
      id, 
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}` // Random color
    };
  });

  // Convert orders to events
  const events = orders.map(order => {
    const photographerId = photographers.find(p => p.name === order.photographer)?.id || 1;
    // Extract time from scheduledTime (format: "10:00 AM")
    const timeString = order.scheduledTime.split(' ')[0];
    // Create a random duration between 1-3 hours
    const durationHours = Math.floor(Math.random() * 3) + 1;
    
    // Parse the time
    const [hours, minutes] = timeString.split(':').map(Number);
    const isAM = order.scheduledTime.includes('AM');
    
    // Create a date object for the start time
    const startDate = new Date(order.scheduledDate);
    startDate.setHours(isAM ? hours : hours + 12);
    startDate.setMinutes(minutes);
    
    // Create a date object for the end time
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);
    
    // Random event type
    const eventTypes = Object.keys(eventColors);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      title: `#${order.orderNumber} - ${order.client.split(' - ')[0]}`,
      photographerId,
      photographer: order.photographer,
      start: startDate,
      end: endDate,
      address: order.address,
      eventType,
      client: order.client,
      phone: "+61 402 123 456", // Sample phone number
      email: "client@example.com", // Sample email
      notes: "Client prefers photos to be bright and airy. Has requested special attention to the outdoor areas.",
      items: ["Real Estate Photography", "Floor Plan", "Drone Photos"],
      color: eventColors[eventType as keyof typeof eventColors]
    };
  });

  // Filter events based on selected photographers
  const filteredEvents = events.filter(event => 
    selectedPhotographers.includes(event.photographerId)
  );

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      
      // If start and end are in the same month
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
      }
      
      // If they span different months
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    } else if (viewMode === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  // Get events for a specific time slot and day
  const getEventsForTimeSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);
    
    const nextSlotTime = new Date(slotTime);
    nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 30); // 30 minute slots
    
    return filteredEvents.filter(event => {
      const eventStart = event.start;
      const eventEnd = event.end;
      
      // Check if event overlaps with this time slot
      return (eventStart < nextSlotTime && eventEnd > slotTime);
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(event.start, day)
    ).sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  // Handle event click
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Create a function to set the view mode that accepts ViewMode
  const handleSetViewMode = (mode: string) => {
    setViewMode(mode as ViewMode);
  };

  return (
    <SidebarLayout showCalendarSubmenu={true}>
      <PageTransition>
        <div className="space-y-4 max-w-full px-0">
          {/* Top navigation area */}
          <CalendarHeader 
            currentDate={currentDate}
            viewMode={viewMode}
            setViewMode={handleSetViewMode}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleToday={handleToday}
            getDateRangeTitle={getDateRangeTitle}
            showCalendarSubmenu={showCalendarSubmenu}
            setShowCalendarSubmenu={setShowCalendarSubmenu}
          />
          
          {/* Main content area */}
          <div className="grid grid-cols-1 gap-4">
            {/* Calendar Views */}
            <Tabs value={viewMode} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="day" className="m-0">
                <CalendarViews 
                  viewMode="day"
                  currentDate={currentDate}
                  getEventsForDay={getEventsForDay}
                  getEventsForTimeSlot={getEventsForTimeSlot}
                  handleEventClick={handleEventClick}
                  filteredEvents={filteredEvents}
                  timeSlots={timeSlots}
                />
              </TabsContent>
              <TabsContent value="week" className="m-0">
                <CalendarViews 
                  viewMode="week"
                  currentDate={currentDate}
                  getEventsForDay={getEventsForDay}
                  getEventsForTimeSlot={getEventsForTimeSlot}
                  handleEventClick={handleEventClick}
                  filteredEvents={filteredEvents}
                  timeSlots={timeSlots}
                />
              </TabsContent>
              <TabsContent value="month" className="m-0">
                <CalendarViews 
                  viewMode="month"
                  currentDate={currentDate}
                  getEventsForDay={getEventsForDay}
                  getEventsForTimeSlot={getEventsForTimeSlot}
                  handleEventClick={handleEventClick}
                  filteredEvents={filteredEvents}
                  timeSlots={timeSlots}
                />
              </TabsContent>
              <TabsContent value="list" className="m-0">
                <CalendarViews 
                  viewMode="list"
                  currentDate={currentDate}
                  getEventsForDay={getEventsForDay}
                  getEventsForTimeSlot={getEventsForTimeSlot}
                  handleEventClick={handleEventClick}
                  filteredEvents={filteredEvents}
                  timeSlots={timeSlots}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageTransition>
      
      {/* Event Details Dialog */}
      <EventDetailsDialog 
        selectedEvent={selectedEvent}
        showEventDetails={showEventDetails}
        setShowEventDetails={setShowEventDetails}
      />
    </SidebarLayout>
  );
};

export default Calendar;
