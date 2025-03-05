
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CalendarView } from './calendar/CalendarView';
import { JobList } from './calendar/JobList';
import { CalendarSkeleton } from './calendar/CalendarSkeleton';
import { isSameDay, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// Define the interface for the JobCountBadge component props
interface JobCountBadgeProps {
  selectedDate: Date | undefined;
  orders: Order[];
}

// Use memo to avoid re-renders
const JobCountBadge = memo(({ selectedDate, orders }: JobCountBadgeProps) => {
  const jobsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), selectedDate)
    );
  }, [orders, selectedDate]);
  
  if (!selectedDate || jobsForSelectedDay.length === 0) return null;
  
  return (
    <Badge variant="secondary">
      {jobsForSelectedDay.length} job{jobsForSelectedDay.length !== 1 ? 's' : ''}
    </Badge>
  );
});

// Ensure the display name is set for React DevTools
JobCountBadge.displayName = 'JobCountBadge';

interface JobCalendarProps {
  calendarView?: "month" | "week" | "day";
  onTimeSlotClick?: (time: string) => void;
}

export function JobCalendar({ calendarView = "month", onTimeSlotClick }: JobCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { orders } = useSampleOrders();
  const { toast } = useToast();
  
  const [viewDates, setViewDates] = useState<Date[]>([]);
  
  // Update view dates when calendarView or selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    
    if (calendarView === "week") {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      setViewDates(eachDayOfInterval({ start, end }));
    } else if (calendarView === "day") {
      setViewDates([selectedDate]);
    } else {
      // For month view, handled by the calendar component
      setViewDates([]);
    }
  }, [calendarView, selectedDate]);

  useEffect(() => {
    console.log("JobCalendar component mounted with view:", calendarView);
    
    // Use requestAnimationFrame for smoother loading transition
    const timer = requestAnimationFrame(() => {
      setIsLoading(false);
    });
    
    return () => {
      console.log("JobCalendar component unmounted");
      cancelAnimationFrame(timer);
    };
  }, [calendarView]);

  // Handle date change with error handling
  const handleDateSelect = useCallback((date: Date | undefined) => {
    try {
      setSelectedDate(date);
      console.log("Selected date:", date ? format(date, 'yyyy-MM-dd') : 'none');
    } catch (error) {
      console.error("Error selecting date:", error);
      toast({
        title: "Error selecting date",
        description: "There was a problem loading jobs for this date",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Handle time slot click
  const handleTimeSlotClick = useCallback((time: string, date?: Date) => {
    console.log("Time slot clicked:", time);
    const clickedDate = date || selectedDate;
    
    if (onTimeSlotClick && clickedDate) {
      // Format the time nicely and pass it to the parent component
      onTimeSlotClick(time);
    }
  }, [onTimeSlotClick, selectedDate]);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {calendarView === "month" 
              ? "Monthly Calendar" 
              : calendarView === "week" 
                ? "Weekly Schedule" 
                : "Daily Schedule"}
          </span>
          <JobCountBadge selectedDate={selectedDate} orders={orders} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-8 ${calendarView === "month" ? "md:grid-cols-2" : "grid-cols-1"}`}>
          <CalendarView 
            orders={orders}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onDateSelected={handleDateSelect}
            onTimeSlotClick={handleTimeSlotClick}
            view={calendarView}
            viewDates={viewDates}
          />
          
          {(calendarView === "month" || !selectedDate) && (
            <JobList
              selectedDate={selectedDate}
              orders={orders}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Wrap the JobCalendar component with ErrorBoundary for better error handling
export function JobCalendarWithErrorBoundary({ calendarView, onTimeSlotClick }: JobCalendarProps) {
  return (
    <ErrorBoundary fallback={
      <Card className="bg-card rounded-lg shadow">
        <CardHeader>
          <CardTitle className="text-red-500">Calendar Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was a problem loading the calendar. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    }>
      <JobCalendar calendarView={calendarView} onTimeSlotClick={onTimeSlotClick} />
    </ErrorBoundary>
  );
}

// Add default export for lazy loading
export default JobCalendarWithErrorBoundary;
