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
  eachDayOfInterval,
  parseISO,
  addMonths,
  subMonths,
  isToday,
  isFuture,
  isPast
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  ArrowLeft,
  ListFilter,
  Plus,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

type ViewMode = 'day' | 'week' | 'month' | 'list';

const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00"
];

// Sample colors for different event types
const eventColors = {
  "residential": "#e57373", // Red
  "commercial": "#64b5f6", // Blue
  "drone": "#ffb74d", // Orange
  "floorplan": "#81c784", // Green
  "video": "#9575cd", // Purple
  "training": "#4db6ac", // Teal
  "meeting": "#f06292", // Pink
  "drive": "#ffd54f"  // Amber
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week'); // Default to week view
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4, 5]);
  const { orders } = useSampleOrders();
  const isMobile = useIsMobile();
  
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
      title: `#${order.orderNumber} - ${order.client.split(' - ')[0]}`,
      photographerId,
      photographer: order.photographer,
      start: startDate,
      end: endDate,
      address: order.address,
      eventType,
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
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      
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

  // Render mobile list view
  const renderMobileListView = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight
    
    // Group events by day
    const eventsByDay = filteredEvents.reduce((acc: Record<string, any[]>, event) => {
      const dateKey = format(event.start, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
    
    // Sort events for each day
    Object.keys(eventsByDay).forEach(dateKey => {
      eventsByDay[dateKey].sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    
    // Separate today's events and future events
    const todayKey = format(now, 'yyyy-MM-dd');
    const todayEvents = eventsByDay[todayKey] || [];
    
    // Get all future dates (excluding today) and sort them
    const futureDates = Object.keys(eventsByDay)
      .filter(dateKey => dateKey > todayKey)
      .sort();
    
    return (
      <div className="space-y-6">
        {/* Today's Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Today</h3>
          {todayEvents.length > 0 ? (
            <div className="space-y-3 relative">
              {/* Time indicator line */}
              <div 
                className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"
                style={{ 
                  height: `${todayEvents.length * 96}px` 
                }}
              />
              
              {/* Current time indicator */}
              <div 
                className="absolute left-0 right-0 flex items-center z-10"
                style={{ 
                  top: `${calculateTimePosition(currentTime, todayEvents)}px` 
                }}
              >
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center -ml-4">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="h-0.5 bg-red-500 w-full" />
              </div>
              
              {todayEvents.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  showDate={false}
                  isPast={isPast(event.end)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No events scheduled for today</p>
          )}
        </div>
        
        {/* Future Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Upcoming</h3>
          <div className="space-y-6">
            {futureDates.length > 0 ? (
              futureDates.map(dateKey => (
                <div key={dateKey} className="space-y-3">
                  <h4 className="font-medium text-muted-foreground">{format(new Date(dateKey), 'EEEE, MMMM d')}</h4>
                  {eventsByDay[dateKey].map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      showDate={false} 
                      isPast={false}
                    />
                  ))}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming events scheduled</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to calculate position for current time indicator
  const calculateTimePosition = (currentTimeMinutes: number, events: any[]) => {
    // If no events, return 0
    if (events.length === 0) return 0;
    
    // Get first and last event times
    const firstEventTime = events[0].start.getHours() * 60 + events[0].start.getMinutes();
    const lastEventEnd = events[events.length - 1].end.getHours() * 60 + events[events.length - 1].end.getMinutes();
    
    // Calculate total time span in minutes
    const timeSpan = lastEventEnd - firstEventTime;
    if (timeSpan <= 0) return 0;
    
    // Calculate position
    const totalHeight = events.length * 96; // 96px per event
    const position = ((currentTimeMinutes - firstEventTime) / timeSpan) * totalHeight;
    
    // Constrain position to be within the view
    return Math.max(0, Math.min(position, totalHeight));
  };
  
  // Event card component for mobile view
  const EventCard = ({ event, showDate = true, isPast = false }) => {
    return (
      <Card className={`${isPast ? 'opacity-60' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            <div 
              className="w-2 self-stretch rounded-full" 
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{event.title}</h4>
                {isPast && (
                  <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">Completed</span>
                )}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </span>
              </div>
              
              {showDate && (
                <div className="text-xs text-muted-foreground mt-1">
                  {format(event.start, 'EEEE, MMMM d')}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                  {event.photographer}
                </span>
                <span className="text-xs text-muted-foreground">
                  {event.eventType}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Function to render the week view calendar
  const renderWeekView = () => {
    // Get the days of the week
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="flex flex-col h-[75vh] overflow-hidden rounded-lg border border-border">
        {/* Header with days of the week */}
        <div className="grid grid-cols-8 bg-background border-b">
          {/* Empty cell for the time column */}
          <div className="p-2 font-medium text-sm text-center border-r">Timezone</div>
          
          {/* Days of the week */}
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 text-center border-r ${
                isSameDay(day, new Date()) ? 'bg-primary/10 font-bold' : ''
              }`}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEE M/d')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="border-r">
              {timeSlots.map((timeSlot, index) => (
                <div 
                  key={index}
                  className="h-14 border-b px-2 text-xs text-muted-foreground flex items-center justify-end pr-2"
                >
                  {timeSlot}
                </div>
              ))}
            </div>
            
            {/* Days columns */}
            {daysOfWeek.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r relative">
                {timeSlots.map((timeSlot, timeIndex) => {
                  const eventsForSlot = getEventsForTimeSlot(day, timeSlot);
                  
                  return (
                    <div key={timeIndex} className="h-14 border-b hover:bg-muted/30 relative">
                      {eventsForSlot.map((event, eventIndex) => {
                        // Calculate position and height based on event timing
                        const eventStartTime = event.start;
                        const eventEndTime = event.end;
                        
                        // Check if this is the starting slot for the event
                        const isStartingSlot = eventStartTime.getHours() === parseInt(timeSlot.split(':')[0]) && 
                                             Math.floor(eventStartTime.getMinutes() / 30) * 30 === parseInt(timeSlot.split(':')[1]);
                        
                        if (!isStartingSlot) return null;
                        
                        // Calculate duration in 30 min slots
                        const durationMs = eventEndTime.getTime() - eventStartTime.getTime();
                        const durationSlots = Math.ceil(durationMs / (30 * 60 * 1000));
                        
                        return (
                          <div
                            key={eventIndex}
                            className="absolute left-0 right-0 mx-1 rounded-md p-1 text-xs overflow-hidden shadow-md z-10"
                            style={{
                              top: '2px',
                              height: `${durationSlots * 3.5}rem - 4px`,
                              backgroundColor: event.color,
                              color: '#fff',
                              zIndex: 10
                            }}
                          >
                            <div className="font-medium">
                              {event.title}
                            </div>
                            <div className="text-white/80 text-[10px]">
                              {format(eventStartTime, 'h:mm a')} - {format(eventEndTime, 'h:mm a')}
                            </div>
                            <div className="text-white/80 text-[10px] truncate">
                              {event.photographer}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarLayout>
      <PageTransition>
        <div className="space-y-4">
          {/* Top navigation area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold">Calendar</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleToday}
              >
                Today
              </Button>
              
              <div className="flex items-center rounded-md border border-input">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-r-none border-r"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm">
                  {getDateRangeTitle()}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-l-none border-l"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {!isMobile && (
                <Tabs 
                  value={viewMode} 
                  onValueChange={(v) => setViewMode(v as ViewMode)}
                  className="h-8"
                >
                  <TabsList className="h-8">
                    <TabsTrigger 
                      value="day" 
                      className="text-xs px-2 h-7"
                    >
                      Day
                    </TabsTrigger>
                    <TabsTrigger 
                      value="week" 
                      className="text-xs px-2 h-7"
                    >
                      Week
                    </TabsTrigger>
                    <TabsTrigger 
                      value="month" 
                      className="text-xs px-2 h-7"
                    >
                      Month
                    </TabsTrigger>
                    <TabsTrigger 
                      value="list" 
                      className="text-xs px-2 h-7"
                    >
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <Button variant="default" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create
              </Button>
            </div>
          </div>
          
          {/* Main calendar content */}
          <div className="grid grid-cols-12 gap-4">
            {/* Sidebar: Filters and photographers */}
            {!isMobile && (
              <div className="col-span-12 md:col-span-3 space-y-4">
                {/* Timezone selector */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Timezone</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Select defaultValue="Australia/Sydney">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                
                {/* Event types filter */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Event Types</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      {Object.entries(eventColors).map(([type, color]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type}`}
                            defaultChecked
                          />
                          <label 
                            htmlFor={`type-${type}`}
                            className="text-sm flex items-center"
                          >
                            <span 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: color }}
                            ></span>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Photographers filter */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1.5" />
                      Photographers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      {photographers.map((photographer) => (
                        <div key={photographer.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`photographer-${photographer.id}`}
                            checked={selectedPhotographers.includes(photographer.id)}
                            onCheckedChange={() => togglePhotographer(photographer.id)}
                          />
                          <label 
                            htmlFor={`photographer-${photographer.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <span 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: photographer.color }}
                            ></span>
                            {photographer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Main calendar area */}
            <div className="col-span-12 md:col-span-9">
              {isMobile ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Scheduled Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderMobileListView()}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <TabsContent value="week" className="mt-0">
                    {renderWeekView()}
                  </TabsContent>
                  
                  <TabsContent value="day" className="mt-0">
                    {/* Day view implementation would go here */}
                    <div className="flex justify-center items-center h-[75vh] border rounded-lg">
                      <p>Day view calendar would be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="month" className="mt-0">
                    {/* Month view implementation would go here */}
                    <div className="flex justify-center items-center h-[75vh] border rounded-lg">
                      <p>Month view calendar would be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="list" className="mt-0">
                    <Card className="border rounded-lg">
                      <CardContent className="p-4">
                        {renderMobileListView()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Calendar;
