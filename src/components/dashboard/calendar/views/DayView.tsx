
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/order-types';
import { format, isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export const DayView = memo(({ date, orders, onTimeSlotClick }: DayViewProps) => {
  const navigate = useNavigate();
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
  
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
  
  // Filter orders for the selected date
  const ordersForDay = allOrders.filter(order => 
    order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
  );
  
  const handleOrderClick = (order: Order) => {
    if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  };
  
  const handleTimeSlotClick = (hour: number) => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  };

  return (
    <div className="day-view bg-background">
      <h3 className="text-lg font-medium mb-4">
        {format(date, 'EEEE, MMMM d, yyyy')}
      </h3>
      
      <div className="time-slots space-y-2">
        {hours.map(hour => {
          const formattedHour = hour % 12 || 12;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          
          // Find orders for this hour
          const ordersForHour = ordersForDay.filter(order => {
            if (!order.scheduledTime) return false;
            
            const timeParts = order.scheduledTime.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
            if (!timeParts) return false;
            
            const orderHour = parseInt(timeParts[1]);
            const isPM = /pm/i.test(timeParts[3]);
            
            let normalizedOrderHour = orderHour;
            if (isPM && orderHour !== 12) normalizedOrderHour += 12;
            if (!isPM && orderHour === 12) normalizedOrderHour = 0;
            
            return normalizedOrderHour === hour;
          });
          
          return (
            <div 
              key={hour}
              className="flex border rounded hover:bg-accent/20 cursor-pointer transition-colors"
              onClick={() => handleTimeSlotClick(hour)}
            >
              <div className="p-2 w-20 text-sm border-r bg-muted/50">
                {formattedHour}:00 {ampm}
              </div>
              <div className="flex-1 p-2">
                {ordersForHour.length > 0 ? (
                  <div className="space-y-2">
                    {ordersForHour.map(order => (
                      <div 
                        key={order.id}
                        className="p-2 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        <div className="font-medium">{order.client || order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.address}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Helper function to get badge class based on status
function getStatusBadgeClass(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

DayView.displayName = 'DayView';
