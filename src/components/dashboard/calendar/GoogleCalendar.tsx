
import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, addMonths, subMonths, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { CalendarHeader } from './header/CalendarHeader';
import { SidebarFilter } from './sidebar/SidebarFilter';
import { GoogleMonthView } from './views/GoogleMonthView';
import { GoogleWeekView } from './views/GoogleWeekView';
import { GoogleDayView } from './views/GoogleDayView';
import { GoogleCardView } from './views/GoogleCardView';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarOrder } from '@/types/calendar';
import { Order as SampleOrder } from '@/hooks/useSampleOrders';

interface GoogleCalendarProps {
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
  defaultView?: "month" | "week" | "day" | "card";
  isMobileView?: boolean;
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
  const [view, setView] = useState<"month" | "week" | "day" | "card">(defaultView);
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4]);
  const { orders, isLoading } = useSampleOrders();

  // Set view based on props when component mounts or when defaultView changes
  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  // Convert orders to CalendarOrder type and filter for selected photographers
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [] as CalendarOrder[];
    
    // Map SampleOrder to CalendarOrder
    const calendarOrders: CalendarOrder[] = orders.map(order => ({
      id: String(order.id), // Convert ID to string to ensure compatibility
      order_number: order.orderNumber,
      client: order.client,
      client_email: order.clientEmail,
      client_phone: order.clientPhone,
      address: order.address,
      city: order.city || '',
      state: order.state || '',
      zip: order.zip || '',
      date_created: new Date().toISOString(),
      scheduled_date: order.scheduledDate,
      scheduled_time: order.scheduledTime,
      photographer: order.photographer,
      package: order.package || '',
      property_type: order.propertyType,
      square_feet: order.squareFeet,
      price: order.price,
      status: order.status as any,
      photographer_payout_rate: order.photographerPayoutRate,
      stripe_payment_id: order.stripePaymentId,
      notes: '',
      location: `${order.address}, ${order.city || ''}, ${order.state || ''} ${order.zip || ''}`,
    }));
    
    return calendarOrders.filter(order => {
      // Match photographer to selected photographers
      return selectedPhotographers.some(id => {
        const photographer = samplePhotographers.find(p => p.id === id);
        return photographer && order.photographer && order.photographer.includes(photographer.name);
      });
    });
  }, [orders, selectedPhotographers]);

  // Navigation functions
  const goToToday = () => setSelectedDate(new Date());
  
  const goToPrevious = () => {
    if (view === "month") {
      setSelectedDate(subMonths(selectedDate, 1));
    } else if (view === "week" || view === "card") {
      setSelectedDate(subDays(selectedDate, 7));
    } else {
      setSelectedDate(subDays(selectedDate, 1));
    }
  };
  
  const goToNext = () => {
    if (view === "month") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else if (view === "week" || view === "card") {
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

  // Handle card click (for card view)
  const handleCardClick = (date: Date) => {
    setSelectedDate(date);
    if (onDayClick) {
      onDayClick(date);
    }
  };

  // Count appointments for selected view
  const appointmentCount = useMemo(() => {
    if (view === "day") {
      return filteredOrders.filter(order => 
        order.scheduled_date && format(new Date(order.scheduled_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      ).length;
    } else if (view === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      
      return filteredOrders.filter(order => {
        if (!order.scheduled_date) return false;
        const orderDate = new Date(order.scheduled_date);
        return orderDate >= weekStart && orderDate <= weekEnd;
      }).length;
    } else {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = addDays(addMonths(monthStart, 1), -1);
      
      return filteredOrders.filter(order => {
        if (!order.scheduled_date) return false;
        const orderDate = new Date(order.scheduled_date);
        return orderDate >= monthStart && orderDate <= monthEnd;
      }).length;
    }
  }, [filteredOrders, selectedDate, view]);

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        date={selectedDate}
        view={view === "card" ? "week" : view}  // Use week header for card view
        appointmentCount={appointmentCount}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewChange={setView}
        isMobileView={isMobileView}
        restrictMobileViews={isMobileView}  // Only show allowed views on mobile
      />
      
      <div className={`flex flex-1 overflow-hidden ${isMobileView ? 'flex-col' : ''}`}>
        {/* Only show sidebar on desktop */}
        {!isMobileView && (
          <SidebarFilter
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        )}
        
        <div className="flex-1 overflow-hidden overflow-y-auto p-4 relative">
          {view === "month" && !isMobileView && (
            <GoogleMonthView 
              date={selectedDate}
              orders={filteredOrders}
              onSelectDate={handleDateSelect}
            />
          )}
          
          {view === "week" && !isMobileView && (
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

          {view === "card" && (
            <GoogleCardView
              date={selectedDate}
              orders={filteredOrders}
              photographers={samplePhotographers}
              selectedPhotographers={selectedPhotographers}
              onCardClick={handleCardClick}
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
