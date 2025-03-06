
import React, { memo, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Order } from '@/hooks/useSampleOrders';
import { DayContentProps } from "react-day-picker";
import { isSameDay } from 'date-fns';
import { Timer, Calendar as CalendarIcon } from 'lucide-react';

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
    <div className="relative flex flex-col items-center justify-center py-1">
      <span className="text-sm font-medium">{date.getDate()}</span>
      {hasJobs && (
        <div className="flex flex-col items-center mt-1">
          <div className="w-6 h-1 bg-primary rounded-full mb-1" />
          {jobsForDay.length > 0 && (
            <div className="text-[0.5rem] text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="h-2 w-2" />
              <span>{jobsForDay.length}</span>
            </div>
          )}
          {totalDrivingTime > 0 && (
            <div className="text-[0.5rem] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Timer className="h-2 w-2" />
              <span>{Math.round(totalDrivingTime / 60)}h</span>
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
    <div className="w-full flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border w-full max-w-3xl"
        components={{
          DayContent: customDayContent
        }}
        showOutsideDays={true}
      />
    </div>
  );
});

MonthView.displayName = 'MonthView';
