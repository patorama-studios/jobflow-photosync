
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/order-types';
import { format, isAfter, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarClock, MapPin, Camera } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgendaViewProps {
  orders: Order[];
}

export const AgendaView = memo(({ orders }: AgendaViewProps) => {
  const navigate = useNavigate();
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  
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
  
  // Filter for upcoming appointments only
  const upcomingOrders = allOrders
    .filter(order => {
      if (!order.scheduledDate) return false;
      const orderDate = new Date(order.scheduledDate);
      return isAfter(orderDate, startOfDay(new Date()));
    })
    .sort((a, b) => {
      if (!a.scheduledDate || !b.scheduledDate) return 0;
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });
  
  const handleOrderClick = (order: Order) => {
    if (order.id) {
      navigate(`/orders/${order.id}`);
    }
  };

  return (
    <div className="agenda-view space-y-4 p-2">
      <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
      
      {upcomingOrders.length > 0 ? (
        <div className="grid gap-4">
          {upcomingOrders.map(order => (
            <Card 
              key={order.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOrderClick(order)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="font-medium">
                    {order.orderNumber || order.order_number || `Order ${order.id}`}
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    {order.scheduledDate && format(new Date(order.scheduledDate), 'MMMM d, yyyy')} 
                    {order.scheduledTime && ` at ${order.scheduledTime}`}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {order.address}
                    {order.city && `, ${order.city}`}
                    {order.state && `, ${order.state}`}
                  </div>
                  
                  {order.photographer && (
                    <div className="flex items-center text-muted-foreground">
                      <Camera className="h-4 w-4 mr-2" />
                      {order.photographer}
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-sm">
                  <div className="font-medium">{order.client}</div>
                  {order.package && <div className="text-muted-foreground">Package: {order.package}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming appointments scheduled
        </div>
      )}
    </div>
  );
});

function getStatusVariant(status?: string): "default" | "secondary" | "destructive" | "outline" | null | undefined {
  switch (status?.toLowerCase()) {
    case 'completed': return 'default';
    case 'scheduled': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}

AgendaView.displayName = 'AgendaView';
