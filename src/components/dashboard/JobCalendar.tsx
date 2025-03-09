
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CalendarView } from './calendar/CalendarView';
import { JobList } from './calendar/JobList';
import { CalendarSkeleton } from './calendar/CalendarSkeleton';
import { isSameDay, format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Define the interface for the JobCountBadge component props
interface JobCountBadgeProps {
  selectedDate: Date | undefined;
  orders: Order[];
}

// Use memo to avoid re-renders
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

// Ensure the display name is set for React DevTools
JobCountBadge.displayName = 'JobCountBadge';

interface JobCalendarProps {
  calendarView?: "month" | "week" | "day" | "agenda";
  onTimeSlotClick?: (time: string) => void;
  onDayClick?: (date: Date) => void;
}

export function JobCalendar({ calendarView = "month", onTimeSlotClick, onDayClick }: JobCalendarProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { orders: sampleOrders, isLoading: ordersLoading } = useSampleOrders();
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  
  const [viewDates, setViewDates] = useState<Date[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
    isMobile ? "agenda" : (calendarView || "month")
  );
  
  // Set up mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && view !== "agenda") {
        setView("agenda");
      } else if (!mobile && view === "agenda" && calendarView !== "agenda") {
        setView(calendarView || "month");
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calendarView, view]);
  
  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .not('scheduled_date', 'is', null);
        
        if (error) {
          console.error('Error fetching orders:', error);
          toast({
            title: "Error loading orders",
            description: "Failed to fetch scheduled appointments",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Convert to Order type with required fields
          const supabaseOrdersData: Order[] = data.map(item => ({
            ...item,
            id: item.id,
            scheduledDate: item.scheduled_date || '',
            scheduledTime: item.scheduled_time || '',
            status: item.status || 'pending',
          }));
          
          setSupabaseOrders(supabaseOrdersData);
        }
      } catch (err) {
        console.error('Error in fetchOrders:', err);
        toast({
          title: "Error loading orders",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchOrders();
  }, [toast]);
  
  // Combine sample orders with Supabase orders
  const allOrders = useMemo(() => [...sampleOrders, ...supabaseOrders], [sampleOrders, supabaseOrders]);
  
  // Update view dates when calendarView or selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    
    if (view === "week") {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      setViewDates(eachDayOfInterval({ start, end }));
    } else if (view === "day") {
      setViewDates([selectedDate]);
    } else {
      // For month view, handled by the calendar component
      setViewDates([]);
    }
  }, [view, selectedDate]);

  useEffect(() => {
    console.log("JobCalendar component mounted with view:", view);
    
    if (ordersLoading) {
      setIsLoading(true);
      return;
    }
    
    // Use requestAnimationFrame for smoother loading transition
    const timer = requestAnimationFrame(() => {
      setIsLoading(false);
    });
    
    return () => {
      console.log("JobCalendar component unmounted");
      cancelAnimationFrame(timer);
    };
  }, [view, ordersLoading]);

  // Handle date change with error handling
  const handleDateSelect = useCallback((date: Date | undefined) => {
    try {
      setSelectedDate(date);
      console.log("Selected date:", date ? format(date, 'yyyy-MM-dd') : 'none');
      
      // Call the onDayClick prop if provided
      if (date && onDayClick) {
        onDayClick(date);
      }
    } catch (error) {
      console.error("Error selecting date:", error);
      toast({
        title: "Error selecting date",
        description: "There was a problem loading jobs for this date",
        variant: "destructive",
      });
    }
  }, [toast, onDayClick]);

  // Handle time slot click
  const handleTimeSlotClick = useCallback((time: string, date?: Date) => {
    console.log("Time slot clicked:", time);
    const clickedDate = date || selectedDate;
    
    if (onTimeSlotClick && clickedDate) {
      // Format the time nicely and pass it to the parent component
      onTimeSlotClick(time);
    }
  }, [onTimeSlotClick, selectedDate]);
  
  // Handle order click to navigate to order details
  const handleOrderClick = useCallback((order: Order) => {
    if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  }, [navigate]);

  if (isLoading || ordersLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <Card className="bg-card rounded-lg shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>
            {view === "month" 
              ? "Monthly Calendar" 
              : view === "week" 
                ? "Weekly Schedule" 
                : view === "day"
                  ? "Daily Schedule"
                  : "Upcoming Appointments"}
          </span>
          <JobCountBadge selectedDate={selectedDate} orders={allOrders} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-8 ${view === "month" ? "grid-cols-1" : "grid-cols-1"}`}>
          <CalendarView 
            orders={allOrders}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            onDateSelected={handleDateSelect}
            onTimeSlotClick={handleTimeSlotClick}
            view={view}
            viewDates={viewDates}
          />
          
          {/* Always show the job list in month view */}
          {view === "month" && (
            <JobList
              selectedDate={selectedDate}
              orders={allOrders}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Wrap the JobCalendar component with ErrorBoundary for better error handling
export function JobCalendarWithErrorBoundary({ calendarView, onTimeSlotClick, onDayClick }: JobCalendarProps) {
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
      <JobCalendar calendarView={calendarView} onTimeSlotClick={onTimeSlotClick} onDayClick={onDayClick} />
    </ErrorBoundary>
  );
}

// Add default export for lazy loading
export default JobCalendarWithErrorBoundary;
