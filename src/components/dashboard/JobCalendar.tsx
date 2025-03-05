
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CalendarView } from './calendar/CalendarView';
import { JobList } from './calendar/JobList';
import { CalendarSkeleton } from './calendar/CalendarSkeleton';
import { isSameDay } from 'date-fns';

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

export function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { orders } = useSampleOrders();
  const { toast } = useToast();

  useEffect(() => {
    console.log("JobCalendar component mounted");
    
    // Use requestAnimationFrame for smoother loading transition
    const timer = requestAnimationFrame(() => {
      setIsLoading(false);
    });
    
    return () => {
      console.log("JobCalendar component unmounted");
      cancelAnimationFrame(timer);
    };
  }, []);

  // Handle date change with error handling
  const handleDateSelect = useCallback((date: Date | undefined) => {
    try {
      setSelectedDate(date);
    } catch (error) {
      console.error("Error selecting date:", error);
      toast({
        title: "Error selecting date",
        description: "There was a problem loading jobs for this date",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Calendar</span>
          <JobCountBadge selectedDate={selectedDate} orders={orders} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          <CalendarView 
            orders={orders}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onDateSelected={handleDateSelect}
          />
          
          <JobList
            selectedDate={selectedDate}
            orders={orders}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Wrap the JobCalendar component with ErrorBoundary for better error handling
export function JobCalendarWithErrorBoundary() {
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
      <JobCalendar />
    </ErrorBoundary>
  );
}

// Add default export for lazy loading
export default JobCalendarWithErrorBoundary;
