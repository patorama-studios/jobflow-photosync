
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Order } from '@/types/orders';
import { CircleDollarSign, CalendarDays, HomeIcon } from 'lucide-react';

interface OrderStatsProps {
  orders: Order[];
}

export const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  // Calculate stats based on orders
  const stats = useMemo(() => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const currentWeekEnd = endOfWeek(now);
    
    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
    
    // Orders this week
    const ordersThisWeek = orders.filter(order => {
      if (!order.scheduledDate) return false;
      const orderDate = new Date(order.scheduledDate);
      return isWithinInterval(orderDate, {
        start: currentWeekStart,
        end: currentWeekEnd
      });
    }).length;
    
    // Pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    
    // Completed orders
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    return {
      totalRevenue,
      ordersThisWeek,
      pendingOrders,
      completedOrders
    };
  }, [orders]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across all orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs This Week</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ordersThisWeek}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingOrders} pending, {stats.completedOrders} completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Properties</CardTitle>
          <HomeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orders.length}</div>
          <p className="text-xs text-muted-foreground">Total orders in system</p>
        </CardContent>
      </Card>
    </div>
  );
};
