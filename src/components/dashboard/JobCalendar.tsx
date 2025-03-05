
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CalendarView } from './calendar/CalendarView';
import { JobList } from './calendar/JobList';
import { CalendarSkeleton } from './calendar/CalendarSkeleton';
import { isSameDay } from 'date-fns';

export function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { orders } = useSampleOrders();
  const { toast } = useToast();

  useEffect(() => {
    console.log("JobCalendar component mounted");
    
    // Simulate loading delay to better see the loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => {
      console.log("JobCalendar component unmounted");
      clearTimeout(timer);
    };
  }, []);

  // Handle date change with error handling
  const handleDateSelect = (date: Date | undefined) => {
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
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Calendar</span>
          {selectedDate && <JobCountBadge selectedDate={selectedDate} orders={orders} />}
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

// Simple component to show job count for selected date
const JobCountBadge = ({ selectedDate, orders }) => {
  const jobsForSelectedDay = orders.filter(order => 
    order.scheduledDate && isSameDay(new Date(order.scheduledDate), selectedDate)
  );
  
  if (jobsForSelectedDay.length === 0) return null;
  
  return (
    <Badge variant="secondary">
      {jobsForSelectedDay.length} job{jobsForSelectedDay.length !== 1 ? 's' : ''}
    </Badge>
  );
};

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
