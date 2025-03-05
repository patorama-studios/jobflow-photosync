
import React, { useMemo, memo, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format, addHours, startOfDay } from "date-fns";
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

// Detailed Day View
const DayView = memo(({ date, orders }: { date: Date, orders: Order[] }) => {
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
          <div key={hour} className="flex border-t border-gray-200 relative" style={{ height: '60px' }}>
            <div className="w-16 text-xs text-gray-500 -mt-2.5">{hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}</div>
            <div className="flex-1"></div>
          </div>
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

// Week View
const WeekView = memo(({ dates, orders }: { dates: Date[], orders: Order[] }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {dates.map(date => (
        <Card key={date.toISOString()} className="min-h-48 h-full">
          <CardContent className="p-2">
            <div className="text-sm font-medium mb-2 text-center">
              {format(date, 'EEE')}
              <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
            </div>
            
            <div className="space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto">
              {orders
                .filter(order => order.scheduledDate && isSameDay(new Date(order.scheduledDate), date))
                .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                .map(job => (
                  <div key={job.id} className="text-xs p-1 bg-primary/10 rounded border-l-2 border-primary">
                    <div className="font-medium">{job.scheduledTime}</div>
                    <div className="truncate">{job.client}</div>
                    {job.drivingTimeMin && (
                      <div className="flex items-center">
                        <Timer className="h-2.5 w-2.5 mr-0.5" />
                        {Math.floor(job.drivingTimeMin / 60)}h {job.drivingTimeMin % 60}m
                      </div>
                    )}
                  </div>
                ))}
              
              {orders.filter(order => 
                order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
              ).length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-2">No appointments</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

WeekView.displayName = 'WeekView';

export function CalendarView({ 
  orders, 
  selectedDate, 
  onSelectDate,
  onDateSelected,
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
    return <DayView date={selectedDate} orders={orders} />;
  }
  
  if (view === "week" && viewDates.length > 0) {
    return <WeekView dates={viewDates} orders={orders} />;
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
