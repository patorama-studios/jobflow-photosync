
import { useState, useEffect } from 'react';
import { convertOrdersToEvents, convertOrdersToTypedOrders } from '@/utils/calendar-event-converter';
import { CalendarEvent } from '@/types/calendar';
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePhotographers } from './use-photographers';
import { useCalendarState } from './use-calendar-state';

export function useGoogleCalendar(
  selectedPhotographers: number[] = [],
  defaultView: "month" | "week" | "day" | "card" = "month"
) {
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "card">(defaultView);
  const { photographers } = usePhotographers();
  const calendarState = useCalendarState();
  const { 
    events, setEvents, 
    date
  } = calendarState;

  // Fetch orders from Supabase
  useEffect(() => {
    async function fetchOrdersFromSupabase() {
      try {
        setIsLoadingSupabase(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Map the data to our Order type
          const mappedOrders: Order[] = data.map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            order_number: order.order_number,
            address: order.address,
            city: order.city,
            state: order.state,
            zip: order.zip,
            client: order.client,
            customerName: order.client,
            propertyAddress: order.address,
            clientEmail: order.client_email,
            client_email: order.client_email,
            clientPhone: order.client_phone,
            client_phone: order.client_phone,
            photographer: order.photographer,
            photographerPayoutRate: order.photographer_payout_rate,
            photographer_payout_rate: order.photographer_payout_rate,
            price: order.price,
            propertyType: order.property_type,
            property_type: order.property_type,
            scheduledDate: order.scheduled_date,
            scheduled_date: order.scheduled_date,
            scheduledTime: order.scheduled_time,
            scheduled_time: order.scheduled_time,
            squareFeet: order.square_feet,
            square_feet: order.square_feet,
            status: order.status,
            package: order.package,
            customerNotes: order.customer_notes,
            customer_notes: order.customer_notes,
            internalNotes: order.internal_notes,
            internal_notes: order.internal_notes,
            notes: order.notes,
          }));
          
          setSupabaseOrders(mappedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders from Supabase:', err);
        toast.error('Error loading orders from database');
      } finally {
        setIsLoadingSupabase(false);
      }
    }
    
    fetchOrdersFromSupabase();
  }, []);

  // Get all active orders
  const { orders: sampleOrders } = useSampleOrders();
  const activeOrders = supabaseOrders.length > 0 ? supabaseOrders : sampleOrders;

  // Convert orders to calendar events
  useEffect(() => {
    const calendarEvents = convertOrdersToEvents(activeOrders);
    setEvents(calendarEvents);
  }, [activeOrders, setEvents]);

  // Filter events based on selected photographers
  const filteredEvents = selectedPhotographers.length > 0
    ? events.filter((event) => selectedPhotographers.includes(event.photographerId))
    : events;

  // Get the filtered orders for the selected date
  const typedOrders = convertOrdersToTypedOrders(activeOrders);
  const filteredOrders = typedOrders.filter(order => {
    // Filter by photographer if needed
    if (selectedPhotographers.length > 0) {
      const photographerMatch = photographers.some(p => 
        selectedPhotographers.includes(p.id) && order.photographer === p.name
      );
      if (!photographerMatch) return false;
    }
    
    // Always filter by date
    const orderDate = new Date(order.scheduledDate);
    return orderDate.toDateString() === date.toDateString();
  });

  // Handle slot selection (clicking on an empty time slot)
  const handleSelectSlot = (
    slotInfo: { start: Date },
    onTimeSlotClick?: (time: string) => void,
    onDayClick?: (date: Date) => void
  ) => {
    calendarState.handleSelectSlot(slotInfo, onTimeSlotClick, onDayClick);
  };

  return {
    viewMode,
    setViewMode,
    filteredEvents,
    activeOrders,
    filteredOrders,
    handleSelectSlot,
    calendarState,
    isLoadingSupabase
  };
}

// Import needed to use the hook, but not used directly in the hook
import { useSampleOrders } from './useSampleOrders';
