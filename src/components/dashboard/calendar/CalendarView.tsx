
import React, { memo, useMemo } from 'react';
import { Order } from '@/types/order-types';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { AgendaView } from './views/AgendaView';
import { isSameDay } from 'date-fns';

interface CalendarViewProps {
  orders: Order[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onDateSelected: (date: Date | undefined) => void;
  onTimeSlotClick?: (time: string) => void;
  view?: "month" | "week" | "day" | "agenda";
  viewDates?: Date[];
}

export const CalendarView = memo(({ 
  orders, 
  selectedDate, 
  onSelectDate,
  onDateSelected,
  onTimeSlotClick,
  view = "month",
  viewDates = []
}: CalendarViewProps) => {
  
  // Get jobs for the selected date
  const jobsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), selectedDate)
    );
  }, [orders, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    onSelectDate(date);
    onDateSelected(date);
  };

  return (
    <div className="w-full">
      {view === "month" && (
        <div className="w-full">
          <MonthView
            orders={orders}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
        </div>
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
      
      {view === "agenda" && (
        <AgendaView
          orders={orders}
        />
      )}
    </div>
  );
});

CalendarView.displayName = 'CalendarView';

export default CalendarView;
