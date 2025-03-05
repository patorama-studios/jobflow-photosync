
import React, { useMemo, memo, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format, startOfDay } from "date-fns";
import { DayContentProps } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { Order } from '@/hooks/useSampleOrders';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Timer } from "lucide-react";

interface CalendarViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onDateSelected: (date: Date | undefined) => void;
  onTimeSlotClick?: (time: string) => void;
  view?: "month" | "week" | "day";
  viewDates?: Date[];
}

interface DayContentComponentProps {
  date: Date;
  daysWithJobs: Set<string>;
  orders: Order[];
}

// Memoized day content component for better performance
const CustomDayContent = memo(({ date, daysWithJobs, orders }: DayContentComponentProps) => {
  const dateStr = date.toISOString().split('T')[0];
  const hasJobs = daysWithJobs.has(dateStr);
  
  // Get jobs for this day for driving time
  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    );
  }, [orders, date]);
  
  // Calculate total driving time
  const totalDrivingTime = useMemo(() => {
    return jobsForDay.reduce((total, job) => {
      return total + (job.drivingTimeMin || 0);
    }, 0);
  }, [jobsForDay]);

  return (
    <div className="relative">
      <span>{date.getDate()}</span>
      {hasJobs && (
        <div className="flex flex-col items-center">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
          {totalDrivingTime > 0 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[0.5rem] text-muted-foreground flex items-center">
              <Timer className="h-2 w-2 mr-0.5" />
              {Math.round(totalDrivingTime / 60)}h
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Set display name for React DevTools
CustomDayContent.displayName = 'CustomDayContent';

// Day view appointment component
const DayAppointment = memo(({ job, startHour }: { job: Order, startHour: number }) => {
  // Calculate position based on time
  const timeComponents = job.scheduledTime.split(':');
  const hour = parseInt(timeComponents[0], 10);
  const minute = parseInt(timeComponents[1].split(' ')[0], 10);
  const isPM = job.scheduledTime.includes('PM');
  
  const jobHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  const topPosition = ((jobHour - startHour) * 60 + minute) / 15;
  
  return (
    <div 
      className="absolute left-0 right-0 bg-primary/10 border-l-4 border-primary rounded-r-md px-2 py-1 truncate"
      style={{ 
        top: `${topPosition * 6}px`, 
        height: '80px',
        zIndex: 10,
      }}
    >
      <div className="text-xs font-medium">{job.scheduledTime} - {job.client}</div>
      <div className="text-xs flex items-center mt-1">
        <MapPin className="h-3 w-3 mr-1" />
        {job.address}
      </div>
      {job.drivingTimeMin && (
        <div className="text-xs flex items-center mt-1">
          <Timer className="h-3 w-3 mr-1" />
          {Math.floor(job.drivingTimeMin / 60)}h {job.drivingTimeMin % 60}m
        </div>
      )}
    </div>
  );
});

DayAppointment.displayName = 'DayAppointment';

// Time slot component for day view
const TimeSlot = memo(({ hour, onTimeSlotClick }: { hour: number, onTimeSlotClick?: (time: string) => void }) => {
  const handleClick = useCallback(() => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  }, [hour, onTimeSlotClick]);

  return (
    <div 
      className="flex border-t border-gray-200 relative hover:bg-accent/30 cursor-pointer transition-colors"
      style={{ height: '60px' }}
      onClick={handleClick}
    >
      <div className="w-16 text-xs text-gray-500 -mt-2.5">{hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}</div>
      <div className="flex-1"></div>
    </div>
  );
});

TimeSlot.displayName = 'TimeSlot';

// Detailed Day View
const DayView = memo(({ 
  date, 
  orders, 
  onTimeSlotClick 
}: { 
  date: Date, 
  orders: Order[], 
  onTimeSlotClick?: (time: string) => void 
}) => {
  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [orders, date]);

  // Determine hours to display (8am-8pm by default)
  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  return (
    <div className="day-view border rounded-md p-4 overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <h3 className="text-lg font-medium mb-4">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      
      <div className="relative">
        {/* Time grid */}
        {hours.map(hour => (
          <TimeSlot key={hour} hour={hour} onTimeSlotClick={onTimeSlotClick} />
        ))}
        
        {/* Appointments */}
        {jobsForDay.map(job => (
          <DayAppointment key={job.id} job={job} startHour={startHour} />
        ))}
      </div>
      
      {jobsForDay.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
});

DayView.displayName = 'DayView';

// Week View Time Slot Component
const WeekTimeSlot = memo(({ 
  date,
  hour,
  onTimeSlotClick 
}: { 
  date: Date,
  hour: number,
  onTimeSlotClick?: (time: string) => void 
}) => {
  const handleClick = useCallback(() => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  }, [hour, onTimeSlotClick]);

  return (
    <div 
      className="p-1 border-t border-gray-200 h-8 hover:bg-accent/30 cursor-pointer transition-colors"
      onClick={handleClick}
    ></div>
  );
});

WeekTimeSlot.displayName = 'WeekTimeSlot';

// Week View
const WeekView = memo(({ 
  dates, 
  orders,
  onTimeSlotClick 
}: { 
  dates: Date[], 
  orders: Order[],
  onTimeSlotClick?: (time: string) => void 
}) => {
  // Hours for the time slots (8am-8pm)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <div className="week-view overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <div className="grid grid-cols-8 gap-1">
        {/* Time column headers */}
        <div className="h-14 flex items-end pb-2">
          <span className="text-xs text-muted-foreground">Time</span>
        </div>
        
        {/* Day column headers */}
        {dates.map(date => (
          <div key={date.toISOString()} className="h-14 flex flex-col items-center justify-end pb-2">
            <div className="text-sm font-medium">{format(date, 'EEE')}</div>
            <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
          </div>
        ))}
        
        {/* Time slots grid */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            {/* Hour label */}
            <div className="text-xs text-muted-foreground h-8 flex items-center">
              {hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}
            </div>
            
            {/* Time slots for each day */}
            {dates.map(date => (
              <WeekTimeSlot 
                key={`${date.toISOString()}-${hour}`}
                date={date}
                hour={hour}
                onTimeSlotClick={(time) => {
                  if (onTimeSlotClick) {
                    onTimeSlotClick(time);
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Appointments overlay */}
      <div className="relative">
        {dates.map((date, dateIndex) => {
          const jobsForDay = orders.filter(order => 
            order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
          );
          
          return jobsForDay.map(job => {
            // Extract hour information from scheduledTime
            const timeComponents = job.scheduledTime.split(':');
            const hour = parseInt(timeComponents[0], 10);
            const isPM = job.scheduledTime.includes('PM');
            const jobHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
            
            // Only show jobs for hours in our grid (8am-8pm)
            if (jobHour < 8 || jobHour > 20) return null;
            
            // Position calculations
            const topPosition = (jobHour - 8) * 32 + 56; // 32px per hour + 56px header offset
            const leftPosition = (dateIndex + 1) * (100 / 8); // +1 for time column
            
            return (
              <div 
                key={job.id}
                className="absolute bg-primary/10 border-l-2 border-primary rounded-r-sm px-1 text-xs"
                style={{
                  top: `${topPosition}px`,
                  left: `${leftPosition}%`,
                  width: `${100/8 - 1}%`,
                  height: '30px',
                  zIndex: 10,
                }}
              >
                <div className="truncate font-medium">{job.client}</div>
                <div className="truncate">{job.scheduledTime}</div>
              </div>
            );
          });
        }).flat().filter(Boolean)}
      </div>
    </div>
  );
});

WeekView.displayName = 'WeekView';

export function CalendarView({ 
  orders, 
  selectedDate, 
  onSelectDate,
  onDateSelected,
  onTimeSlotClick,
  view = "month",
  viewDates = []
}: CalendarViewProps) {
  const { toast } = useToast();
  
  // Memoize the calendar days with job indicators to avoid recalculating on every render
  const daysWithJobs = useMemo(() => {
    const days = new Set<string>();
    
    orders.forEach(order => {
      if (order.scheduledDate) {
        try {
          const dateStr = new Date(order.scheduledDate).toISOString().split('T')[0];
          days.add(dateStr);
        } catch (error) {
          console.error("Error parsing date:", order.scheduledDate, error);
        }
      }
    });
    
    console.log(`Found ${days.size} days with jobs`);
    return days;
  }, [orders]);

  // Handle date selection with notification
  const handleDateSelect = useCallback((date: Date | undefined) => {
    try {
      onSelectDate(date);
      
      if (date) {
        const jobCount = orders.filter(order => 
          order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
        ).length;
        
        if (jobCount > 0) {
          toast({
            title: `${jobCount} jobs on ${format(date, 'MMMM d, yyyy')}`,
            description: "Click on a job to view details",
          });
        }
      }
    } catch (error) {
      console.error("Error in date selection:", error);
    }
  }, [onSelectDate, orders, toast]);

  // Optimized custom day renderer
  const customDayContent = useCallback((dayProps: DayContentProps) => {
    try {
      return <CustomDayContent date={dayProps.date} daysWithJobs={daysWithJobs} orders={orders} />;
    } catch (error) {
      console.error("Error rendering calendar day:", error);
      return <div>{dayProps.date.getDate()}</div>;
    }
  }, [daysWithJobs, orders]);

  // Render different views based on the view prop
  if (view === "day" && selectedDate) {
    return <DayView date={selectedDate} orders={orders} onTimeSlotClick={onTimeSlotClick} />;
  }
  
  if (view === "week" && viewDates.length > 0) {
    return <WeekView dates={viewDates} orders={orders} onTimeSlotClick={onTimeSlotClick} />;
  }

  // Default month view
  return (
    <div className="calendar-container">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
        components={{
          DayContent: customDayContent
        }}
      />
    </div>
  );
}

// Export with memo for better performance
export default memo(CalendarView);
