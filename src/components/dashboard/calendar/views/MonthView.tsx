
import React, { memo, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Order } from '@/hooks/useSampleOrders';
import { DayContentProps } from "react-day-picker";
import { isSameDay } from 'date-fns';
import { Timer } from 'lucide-react';

interface MonthViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

// Memoized day content component for better performance
const CustomDayContent = memo(({ 
  date, 
  daysWithJobs, 
  orders 
}: { 
  date: Date;
  daysWithJobs: Set<string>;
  orders: Order[];
}) => {
  const dateStr = date.toISOString().split('T')[0];
  const hasJobs = daysWithJobs.has(dateStr);
  
  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    );
  }, [orders, date]);
  
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

CustomDayContent.displayName = 'CustomDayContent';

export const MonthView = memo(({ orders, selectedDate, onSelectDate }: MonthViewProps) => {
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
    return days;
  }, [orders]);

  const customDayContent = (dayProps: DayContentProps) => (
    <CustomDayContent 
      date={dayProps.date} 
      daysWithJobs={daysWithJobs} 
      orders={orders} 
    />
  );

  return (
    <div className="calendar-container">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border"
        components={{
          DayContent: customDayContent
        }}
      />
    </div>
  );
});

MonthView.displayName = 'MonthView';
