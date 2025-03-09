
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/order-types';
import { WeekGrid } from './components/WeekGrid';
import { WeekAppointments } from './components/WeekAppointments';
import { WeekRescheduleDialog } from './components/WeekRescheduleDialog';
import { useWeekView, useWeekAppointments } from './hooks/useWeekView';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeekViewProps {
  dates: Date[];
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export const WeekView = memo(({ dates, orders, onTimeSlotClick }: WeekViewProps) => {
  const navigate = useNavigate();
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  
  // Use custom hooks for logic
  const {
    draggedOrder,
    newScheduleData,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDragStart,
    handleDrop,
    handleConfirmReschedule,
    handleCancelReschedule
  } = useWeekView();
  
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
          toast.error('Failed to load scheduled appointments');
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
        toast.error('An unexpected error occurred while loading appointments');
      }
    };

    fetchOrders();
  }, []);
  
  // Combine local orders with Supabase orders
  const allOrders = [...orders, ...supabaseOrders];
  
  // Get calculated appointments
  const weekAppointments = useWeekAppointments(allOrders, dates);

  // Handle appointment click to navigate to order details
  const handleAppointmentClick = (order: Order) => {
    if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  };

  return (
    <div className="week-view overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <WeekGrid 
        dates={dates}
        hours={hours}
        onTimeSlotClick={onTimeSlotClick}
        onDrop={handleDrop}
      />

      <WeekAppointments 
        weekAppointments={weekAppointments}
        dates={dates}
        onDragStart={handleDragStart}
        onAppointmentClick={handleAppointmentClick}
      />
      
      <WeekRescheduleDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmReschedule}
        onCancel={handleCancelReschedule}
        orderData={newScheduleData}
      />
    </div>
  );
});

WeekView.displayName = 'WeekView';
