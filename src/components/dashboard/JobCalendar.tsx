
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Order } from '@/hooks/useSampleOrders';
import { DayContentProps } from "react-day-picker";
import { ErrorBoundary } from '@/components/ErrorBoundary';

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

  // Memoize the calendar days with job indicators to avoid recalculating on every render
  const daysWithJobs = useMemo(() => {
    const days = new Set<string>();
    
    orders.forEach(order => {
      if (order.scheduledDate) {
        const dateStr = new Date(order.scheduledDate).toISOString().split('T')[0];
        days.add(dateStr);
      }
    });
    
    console.log(`Found ${days.size} days with jobs`);
    return days;
  }, [orders]);

  // Memoize the jobs for the selected date to avoid filtering on every render
  const jobsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), selectedDate)
    );
  }, [orders, selectedDate]);

  // Handle date change with error handling
  const handleDateSelect = (date: Date | undefined) => {
    try {
      setSelectedDate(date);
      
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
      console.error("Error selecting date:", error);
      toast({
        title: "Error selecting date",
        description: "There was a problem loading jobs for this date",
        variant: "destructive",
      });
    }
  };

  // Custom day renderer that adds indicators for days with jobs
  const customDayContent = (dayProps: DayContentProps) => {
    try {
      // Extract the date from props
      const date = dayProps.date;
      const dateStr = date.toISOString().split('T')[0];
      const hasJobs = daysWithJobs.has(dateStr);
      
      return (
        <div className="relative">
          <span>{date.getDate()}</span>
          {hasJobs && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
          )}
        </div>
      );
    } catch (error) {
      console.error("Error rendering calendar day:", error);
      return <div>{dayProps.date.getDate()}</div>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card rounded-lg shadow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Calendar</span>
            <Badge variant="outline" className="animate-pulse">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-lg"></div>
            <div className="mt-4 h-4 w-48 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Calendar</span>
          {selectedDate && jobsForSelectedDay.length > 0 && (
            <Badge variant="secondary">
              {jobsForSelectedDay.length} job{jobsForSelectedDay.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
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
          
          <div>
            <h3 className="text-lg font-medium mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </h3>
            
            {selectedDate && jobsForSelectedDay.length === 0 ? (
              <p className="text-muted-foreground">No appointments scheduled for this day.</p>
            ) : (
              <div className="space-y-4">
                {jobsForSelectedDay.map((job: Order) => (
                  <div key={job.id} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className="flex justify-between">
                      <p className="font-medium">{job.orderNumber}</p>
                      <span className="text-sm text-muted-foreground">{job.scheduledTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.address}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1">
                        <p className="text-sm">{job.client}</p>
                      </div>
                      <Badge variant={job.status === 'completed' ? 'success' : 'default'}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
