
import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, addMonths, subMonths, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { CalendarHeader } from './header/CalendarHeader';
import { SidebarFilter } from './sidebar/SidebarFilter';
import { GoogleMonthView } from './views/GoogleMonthView';
import { GoogleWeekView } from './views/GoogleWeekView';
import { GoogleDayView } from './views/GoogleDayView';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface GoogleCalendarProps {
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: "month" | "week" | "day";
  isMobileView?: boolean;
}

// Define types for the view components
interface GoogleWeekViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

interface GoogleDayViewProps {
  date: Date;
  orders: Order[];
  photographers: Array<{id: number; name: string; color: string}>;
  selectedPhotographers: number[];
  onTimeSlotClick?: (time: string) => void;
}

const samplePhotographers = [
  { id: 1, name: 'David Thompson', color: '#4299E1' },  // Blue
  { id: 2, name: 'Emma Richardson', color: '#F6E05E' }, // Yellow
  { id: 3, name: 'Michael Clem', color: '#F6AD55' },    // Orange
  { id: 4, name: 'Sophia Martinez', color: '#F687B3' }, // Pink
];

export const GoogleCalendar: React.FC<GoogleCalendarProps> = ({
  onTimeSlotClick,
  onDayClick,
  defaultView = "month",
  isMobileView = false
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">(defaultView);
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4]);
  const { orders, isLoading } = useSampleOrders();

  // Filter orders for selected photographers
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    
    return orders.filter(order => {
      // Match photographer to selected photographers
      // In a real app, we would match by photographer ID
      return selectedPhotographers.some(id => {
        const photographer = samplePhotographers.find(p => p.id === id);
        return photographer && order.photographer.includes(photographer.name);
      });
    });
  }, [orders, selectedPhotographers]);

  // Navigation functions
  const goToToday = () => setSelectedDate(new Date());
  
  const goToPrevious = () => {
    if (view === "month") {
      setSelectedDate(subMonths(selectedDate, 1));
    } else if (view === "week") {
      setSelectedDate(subDays(selectedDate, 7));
    } else {
      setSelectedDate(subDays(selectedDate, 1));
    }
  };
  
  const goToNext = () => {
    if (view === "month") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else if (view === "week") {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (onDayClick) {
        onDayClick(date);
      }
    }
  };

  // Handle time slot click
  const handleTimeSlotClick = (time: string) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(time);
    }
  };

  // Count appointments for selected view
  const appointmentCount = useMemo(() => {
    if (view === "day") {
      return filteredOrders.filter(order => 
        order.scheduledDate && format(new Date(order.scheduledDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      ).length;
    } else if (view === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      
      return filteredOrders.filter(order => {
        if (!order.scheduledDate) return false;
        const orderDate = new Date(order.scheduledDate);
        return orderDate >= weekStart && orderDate <= weekEnd;
      }).length;
    } else {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = addDays(addMonths(monthStart, 1), -1);
      
      return filteredOrders.filter(order => {
        if (!order.scheduledDate) return false;
        const orderDate = new Date(order.scheduledDate);
        return orderDate >= monthStart && orderDate <= monthEnd;
      }).length;
    }
  }, [filteredOrders, selectedDate, view]);

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        date={selectedDate}
        view={view}
        appointmentCount={appointmentCount}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewChange={setView}
        isMobileView={isMobileView}
      />
      
      <div className={`flex flex-1 overflow-hidden ${isMobileView ? 'flex-col' : ''}`}>
        {/* Only show sidebar on desktop */}
        {!isMobileView && (
          <SidebarFilter
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        )}
        
        <div className="flex-1 overflow-hidden p-4 relative">
          {view === "month" && (
            <GoogleMonthView 
              date={selectedDate}
              orders={filteredOrders}
              onSelectDate={handleDateSelect}
            />
          )}
          
          {view === "week" && (
            <GoogleWeekView 
              date={selectedDate}
              orders={filteredOrders}
              onTimeSlotClick={handleTimeSlotClick}
            />
          )}
          
          {view === "day" && (
            <GoogleDayView 
              date={selectedDate}
              orders={filteredOrders}
              photographers={samplePhotographers}
              selectedPhotographers={selectedPhotographers}
              onTimeSlotClick={handleTimeSlotClick}
            />
          )}
          
          {/* Only show floating action button on desktop */}
          {!isMobileView && (
            <div className="absolute bottom-8 right-8">
              <Button 
                size="lg" 
                className="rounded-full h-14 w-14 shadow-lg"
                onClick={() => {
                  if (onDayClick) onDayClick(selectedDate);
                }}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
