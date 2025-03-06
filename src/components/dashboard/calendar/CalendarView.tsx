
import React, { useState, useEffect, memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Order } from '@/hooks/useSampleOrders';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { JobList } from './JobList';
import { isSameDay } from 'date-fns';

interface JobCountBadgeProps {
  selectedDate: Date | undefined;
  orders: Order[];
}

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

JobCountBadge.displayName = 'JobCountBadge';

interface CalendarViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onDateSelected: (date: Date | undefined) => void;
  onTimeSlotClick?: (time: string) => void;
  view?: "month" | "week" | "day";
  viewDates?: Date[];
}

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
  
  const handleDateSelect = (date: Date | undefined) => {
    onSelectDate(date);
    onDateSelected(date);
    
    if (date) {
      const jobCount = orders.filter(order => 
        order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
      ).length;
      
      if (jobCount > 0) {
        toast({
          title: `${jobCount} jobs scheduled`,
          description: "Click on a job to view details",
        });
      }
    }
  };

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {view === "month" 
              ? "Monthly Calendar" 
              : view === "week" 
                ? "Weekly Schedule" 
                : "Daily Schedule"}
          </span>
          <JobCountBadge selectedDate={selectedDate} orders={orders} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-8 ${view === "month" ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {view === "month" && (
            <MonthView
              orders={orders}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />
          )}
          
          {view === "week" && viewDates.length > 0 && (
            <WeekView
              dates={viewDates}
              orders={orders}
              onTimeSlotClick={onTimeSlotClick}
            />
          )}
          
          {view === "day" && selectedDate && (
            <DayView
              date={selectedDate}
              orders={orders}
              onTimeSlotClick={onTimeSlotClick}
            />
          )}
          
          {(view === "month" || !selectedDate) && (
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

export default memo(CalendarView);
