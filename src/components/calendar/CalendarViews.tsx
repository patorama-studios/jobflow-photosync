
import React from 'react';
import { 
  format, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  startOfMonth, 
  endOfMonth, 
  isPast
} from 'date-fns';
import { Clock, Car } from 'lucide-react';
import { EventCard } from './EventCard';

interface CalendarViewsProps {
  viewMode: string;
  currentDate: Date;
  getEventsForDay: (day: Date) => any[];
  getEventsForTimeSlot: (day: Date, timeSlot: string) => any[];
  handleEventClick: (event: any) => void;
  filteredEvents: any[];
  timeSlots: string[];
}

// Helper function to calculate position for current time indicator
const calculateTimePosition = (currentTimeMinutes: number, events: any[]) => {
  if (events.length === 0) return 0;
  
  const firstEventTime = events[0].start.getHours() * 60 + events[0].start.getMinutes();
  const lastEventEnd = events[events.length - 1].end.getHours() * 60 + events[events.length - 1].end.getMinutes();
  
  const timeSpan = lastEventEnd - firstEventTime;
  if (timeSpan <= 0) return 0;
  
  const totalHeight = events.length * 96; // 96px per event
  const position = ((currentTimeMinutes - firstEventTime) / timeSpan) * totalHeight;
  
  return Math.max(0, Math.min(position, totalHeight));
};

// Check if a time slot is near the current time
const isTimeNearCurrent = (timeSlot: string) => {
  const now = new Date();
  const [hours, minutes] = timeSlot.split(':').map(Number);
  
  return now.getHours() === hours && 
         Math.abs(now.getMinutes() - minutes) < 30;
};

export const CalendarViews: React.FC<CalendarViewsProps> = ({
  viewMode,
  currentDate,
  getEventsForDay,
  getEventsForTimeSlot,
  handleEventClick,
  filteredEvents,
  timeSlots
}) => {
  // Mobile list view
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

  // Month view calendar
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get the first day of the month
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    
    // Get the last day of the month
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // End on Sunday
    
    // Get all days in the month view
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group the days into weeks
    const weeks = [];
    let week = [];
    
    dateRange.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });
    
    if (week.length > 0) {
      weeks.push(week);
    }
    
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header with day names */}
        <div className="grid grid-cols-7 bg-muted">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={index} className="p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-1 divide-y divide-border">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 divide-x divide-border">
              {week.map((day, dayIndex) => {
                const eventsForDay = getEventsForDay(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`min-h-[120px] p-1 ${
                      isCurrentMonth ? 'bg-background' : 'bg-muted/30 text-muted-foreground'
                    } ${isToday(day) ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`text-right p-1 ${isToday(day) ? 'font-bold text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[90px]">
                      {eventsForDay.slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className="text-[10px] mb-1 p-1 rounded truncate cursor-pointer"
                          style={{ backgroundColor: event.color, color: '#fff' }}
                          onClick={() => handleEventClick(event)}
                        >
                          {format(event.start, 'h:mm a')} {event.title}
                        </div>
                      ))}
                      
                      {eventsForDay.length > 3 && (
                        <div className="text-[10px] text-center text-muted-foreground">
                          +{eventsForDay.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Week view calendar
  const renderWeekView = () => {
    // Get the days of the week starting from Monday
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="flex flex-col h-[75vh] overflow-hidden rounded-lg border border-border">
        {/* Header with days of the week */}
        <div className="grid grid-cols-8 bg-background border-b">
          {/* Empty cell for the time column */}
          <div className="p-2 font-medium text-sm text-center border-r">Time</div>
          
          {/* Days of the week */}
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 text-center border-r ${
                isSameDay(day, new Date()) ? 'bg-primary/10 font-bold' : ''
              }`}
            >
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-xs text-muted-foreground">{format(day, 'MMM d')}</div>
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
                            className="absolute left-0 right-0 mx-1 rounded-md p-1 text-xs overflow-hidden shadow-md z-10 cursor-pointer"
                            style={{
                              top: '2px',
                              height: `${durationSlots * 3.5}rem - 4px`,
                              backgroundColor: event.color,
                              color: '#fff',
                              zIndex: 10
                            }}
                            onClick={() => handleEventClick(event)}
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
  
  // Day view
  const renderDayView = () => {
    const eventsForDay = getEventsForDay(currentDate);
    
    return (
      <div className="grid grid-cols-1 divide-y divide-border border border-border rounded-lg overflow-hidden">
        <div className="p-4 bg-muted">
          <h2 className="text-lg font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
        </div>
        
        <div className="divide-y divide-border">
          {timeSlots.map((timeSlot, index) => {
            const eventsForTimeSlot = getEventsForTimeSlot(currentDate, timeSlot);
            const isCurrentTime = isTimeNearCurrent(timeSlot);
            
            return (
              <div 
                key={index} 
                className={`grid grid-cols-6 ${isCurrentTime ? 'bg-primary/5' : ''}`}
              >
                <div className="col-span-1 p-2 border-r border-border">
                  <div className="text-sm text-muted-foreground">
                    {timeSlot}
                  </div>
                </div>
                
                <div className="col-span-5 p-2 min-h-[4rem] relative">
                  {eventsForTimeSlot.map((event, eventIndex) => {
                    const eventStartTime = event.start;
                    const isStartingSlot = eventStartTime.getHours() === parseInt(timeSlot.split(':')[0]) && 
                                         Math.floor(eventStartTime.getMinutes() / 30) * 30 === parseInt(timeSlot.split(':')[1]);
                    
                    if (!isStartingSlot) return null;
                    
                    return (
                      <div 
                        key={eventIndex}
                        className="mb-2 p-2 rounded shadow-sm cursor-pointer"
                        style={{ backgroundColor: event.color, color: '#fff' }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                        <div className="text-sm">{event.photographer}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (viewMode === 'day') {
    return renderDayView();
  } else if (viewMode === 'week') {
    return renderWeekView();
  } else if (viewMode === 'month') {
    return renderMonthView();
  } else {
    return renderMobileListView();
  }
};
