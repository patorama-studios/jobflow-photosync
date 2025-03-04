
import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { 
  Calendar as CalendarComponent, 
  CalendarProps 
} from '@/components/ui/calendar';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  CalendarDays, 
  Calendar as CalendarIcon, 
  ClockIcon,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ViewMode = 'month' | 'week' | 'day';

// Sample photographer starting locations (would come from settings in a real app)
const PHOTOGRAPHER_STARTING_LOCATIONS = {
  1: { address: "123 Main St, Seattle, WA", lat: 47.6062, lng: -122.3321 },
  2: { address: "456 Pine Ave, Bellevue, WA", lat: 47.6101, lng: -122.2015 },
  3: { address: "789 Oak Blvd, Kirkland, WA", lat: 47.6769, lng: -122.2060 },
  4: { address: "321 Elm St, Redmond, WA", lat: 47.6740, lng: -122.1215 },
  5: { address: "654 Cedar Rd, Renton, WA", lat: 47.4829, lng: -122.2171 },
};

// Function to calculate driving time between two locations
const calculateDrivingTime = (startLat, startLng, endLat, endLng) => {
  // In a real app, this would use a mapping API like Google Maps
  // Here we'll use a simple distance formula and convert to minutes
  const R = 6371; // Radius of the earth in km
  const dLat = (endLat - startLat) * Math.PI / 180;
  const dLon = (endLng - startLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(startLat * Math.PI / 180) * Math.cos(endLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Assume average speed of 40 km/h in city traffic
  const timeInMinutes = Math.round((distance / 40) * 60);
  return timeInMinutes;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4, 5]);
  const { orders } = useSampleOrders();

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

  // Convert orders to calendar events with additional driving time information
  const calendarEvents = orders.map(order => {
    const photographerId = photographers.find(p => p.name === order.photographer)?.id || 1;
    return {
      ...order,
      photographerId,
      date: new Date(order.scheduledDate), // Convert ISO string to Date
    };
  });

  // Process events to add driving time information
  const processedEvents = [...calendarEvents].sort((a, b) => {
    // Sort by date, then by time
    const dateA = a.date;
    const dateB = b.date;
    const timeA = a.scheduledTime;
    const timeB = b.scheduledTime;
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Convert time strings to comparable values (assuming format like "10:00 AM")
    const timeValueA = timeA.replace(':', '').replace(/\s/g, '');
    const timeValueB = timeB.replace(':', '').replace(/\s/g, '');
    return timeValueA.localeCompare(timeValueB);
  });

  // Add driving time information
  processedEvents.forEach((event, index) => {
    const photographerId = event.photographerId;
    const startLocation = PHOTOGRAPHER_STARTING_LOCATIONS[photographerId];
    
    // If it's the first event of the day for this photographer
    const prevEventSameDay = processedEvents.slice(0, index).reverse().find(e => 
      e.photographerId === photographerId && 
      e.date.getDate() === event.date.getDate() &&
      e.date.getMonth() === event.date.getMonth() &&
      e.date.getFullYear() === event.date.getFullYear()
    );
    
    if (!prevEventSameDay) {
      // Calculate driving time from starting location
      event.drivingTimeMin = calculateDrivingTime(
        startLocation.lat, 
        startLocation.lng, 
        startLocation.lat + (Math.random() * 0.1), // Dummy end location (would be geocoded from address)
        startLocation.lng + (Math.random() * 0.1)
      );
      event.previousLocation = startLocation.address;
    } else {
      // Calculate driving time from previous event
      event.drivingTimeMin = calculateDrivingTime(
        startLocation.lat + (Math.random() * 0.1), // Dummy start (would be previous event location)
        startLocation.lng + (Math.random() * 0.1),
        startLocation.lat + (Math.random() * 0.1), // Dummy end (would be current event location)
        startLocation.lng + (Math.random() * 0.1)
      );
      event.previousLocation = prevEventSameDay.address;
    }
  });

  // Filter events based on selected photographers
  const filteredEvents = processedEvents.filter(event => 
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

  const getDateTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  // Format driving time for display
  const formatDrivingTime = (minutes) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  // We'll use this to highlight dates with jobs
  const datesWithJobs = filteredEvents.map(event => event.date);

  const renderMonthView = () => (
    <div className="bg-white rounded-md shadow">
      <CalendarComponent
        mode="single"
        selected={currentDate}
        onSelect={(date) => date && setCurrentDate(date)}
        className="rounded-md border"
        modifiers={{
          hasJob: datesWithJobs,
        }}
        modifiersClassNames={{
          hasJob: "bg-primary/20 font-medium text-primary",
        }}
      />
    </div>
  );

  const renderWeekView = () => (
    <div className="bg-white rounded-md shadow p-4">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, index) => {
          const day = addDays(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
            index
          );
          const dayEvents = filteredEvents.filter(event => 
            event.date.getDate() === day.getDate() && 
            event.date.getMonth() === day.getMonth() && 
            event.date.getFullYear() === day.getFullYear()
          ).sort((a, b) => {
            // Sort by time
            const timeA = a.scheduledTime.replace(':', '').replace(/\s/g, '');
            const timeB = b.scheduledTime.replace(':', '').replace(/\s/g, '');
            return timeA.localeCompare(timeB);
          });
          
          return (
            <div 
              key={index} 
              className={`min-h-[200px] border rounded-md p-2 ${
                day.getDate() === new Date().getDate() && 
                day.getMonth() === new Date().getMonth() && 
                day.getFullYear() === new Date().getFullYear() 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
            >
              <div className="text-center mb-2 font-medium">
                <div className="text-sm text-muted-foreground">{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
              <div className="space-y-2">
                {dayEvents.map((event, eventIndex) => (
                  <div key={event.id} className="space-y-1">
                    {event.drivingTimeMin > 0 && (
                      <div className="flex items-center text-xs text-muted-foreground space-x-1 pl-1">
                        <Car className="h-3 w-3" />
                        <span>{formatDrivingTime(event.drivingTimeMin)}</span>
                      </div>
                    )}
                    <div 
                      className="text-xs p-2 rounded" 
                      style={{ 
                        backgroundColor: photographers.find(p => p.id === event.photographerId)?.color + '20',
                        borderLeft: `3px solid ${photographers.find(p => p.id === event.photographerId)?.color}`
                      }}
                    >
                      <div className="font-medium truncate">{event.orderNumber}</div>
                      <div className="truncate">{event.address.split(',')[0]}</div>
                      <div className="flex justify-between">
                        <span>{event.scheduledTime}</span>
                        <span className="truncate max-w-[80px]">{event.client.split(' - ')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="bg-white rounded-md shadow p-4">
      <div className="space-y-2">
        <div className="text-center font-medium text-lg mb-4">
          {format(currentDate, 'EEEE, MMMM d')}
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 12 }).map((_, index) => {
            const hour = index + 8; // Start from 8 AM
            const hourEvents = filteredEvents.filter(event => 
              event.date.getDate() === currentDate.getDate() && 
              event.date.getMonth() === currentDate.getMonth() && 
              event.date.getFullYear() === currentDate.getFullYear() &&
              parseInt(event.scheduledTime.split(':')[0]) === (hour % 12 === 0 ? 12 : hour % 12) &&
              event.scheduledTime.includes(hour < 12 ? 'AM' : 'PM')
            );
            
            return (
              <div key={index} className="grid grid-cols-12 border-b py-2">
                <div className="col-span-1 text-right pr-4 text-muted-foreground">
                  {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}
                </div>
                <div className="col-span-11 border-l pl-4 min-h-[40px]">
                  {hourEvents.map((event, eventIndex) => (
                    <div key={event.id} className="space-y-1 mb-3">
                      {event.drivingTimeMin > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-muted-foreground space-x-1 pl-1">
                                <Car className="h-3 w-3" />
                                <span>{formatDrivingTime(event.drivingTimeMin)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-xs">Drive from: {event.previousLocation}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <div 
                        className="text-sm p-2 rounded" 
                        style={{ 
                          backgroundColor: photographers.find(p => p.id === event.photographerId)?.color + '20',
                          borderLeft: `3px solid ${photographers.find(p => p.id === event.photographerId)?.color}`
                        }}
                      >
                        <div className="font-medium flex justify-between">
                          <span>{event.orderNumber}</span>
                          <span className="text-xs text-muted-foreground">{event.scheduledTime}</span>
                        </div>
                        <div className="text-xs">{event.address}</div>
                        <div className="text-xs flex justify-between mt-1">
                          <span>Client: {event.client.split(' - ')[0]}</span>
                          <span className="text-muted-foreground">{event.client.split(' - ')[1] || ''}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Photographer: {event.photographer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      <PageTransition>
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-semibold">Photography Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your shooting schedule and assignments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium w-40 text-center">
              {getDateTitle()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main content - calendar views */}
          <div className="col-span-12 md:col-span-9">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Schedule</CardTitle>
                  <Tabs 
                    value={viewMode} 
                    onValueChange={(v) => setViewMode(v as ViewMode)}
                    className="w-fit"
                  >
                    <TabsList>
                      <TabsTrigger value="month" className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Month
                      </TabsTrigger>
                      <TabsTrigger value="week" className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="day" className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4" />
                        Day
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - photographer filters */}
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Photographers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Calendar;
