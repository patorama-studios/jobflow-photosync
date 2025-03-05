
import React, { useMemo, memo, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format } from "date-fns";
import { DayContentProps } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { Order } from '@/hooks/useSampleOrders';

interface CalendarViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onDateSelected: (date: Date | undefined) => void;
}

interface DayContentComponentProps {
  date: Date;
  daysWithJobs: Set<string>;
}

// Memoized day content component for better performance
const CustomDayContent = memo(({ date, daysWithJobs }: DayContentComponentProps) => {
  const dateStr = date.toISOString().split('T')[0];
  const hasJobs = daysWithJobs.has(dateStr);
  
  return (
    <div className="relative">
      <span>{date.getDate()}</span>
      {hasJobs && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </div>
  );
});

// Set display name for React DevTools
CustomDayContent.displayName = 'CustomDayContent';

export function CalendarView({ 
  orders, 
  selectedDate, 
  onSelectDate,
  onDateSelected
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
      return <CustomDayContent date={dayProps.date} daysWithJobs={daysWithJobs} />;
    } catch (error) {
      console.error("Error rendering calendar day:", error);
      return <div>{dayProps.date.getDate()}</div>;
    }
  }, [daysWithJobs]);

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
