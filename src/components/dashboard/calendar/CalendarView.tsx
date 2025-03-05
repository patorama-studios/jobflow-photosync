
import React, { useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from "date-fns";
import { format } from "date-fns";
import { DayContentProps } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { Order } from '@/hooks/useSampleOrders';

interface CalendarViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onDateSelected: (date: Date | undefined) => void;
}

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
        const dateStr = new Date(order.scheduledDate).toISOString().split('T')[0];
        days.add(dateStr);
      }
    });
    
    console.log(`Found ${days.size} days with jobs`);
    return days;
  }, [orders]);

  // Handle date selection with notification
  const handleDateSelect = (date: Date | undefined) => {
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

  return (
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
  );
}
