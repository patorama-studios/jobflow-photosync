import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from '@/hooks/use-orders';
import { DollarSign, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function OrderStats() {
  const { orders, isLoading } = useOrders();

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    
    // Calculate stats
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const ordersThisMonth = orders.filter(order => {
      const orderDate = new Date(order.scheduled_date);
      return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
    });
    
    const totalRevenue = ordersThisMonth.reduce((sum, order) => sum + order.price, 0);
    const completedOrders = ordersThisMonth.filter(order => order.status === 'completed').length;
    const scheduledOrders = ordersThisMonth.filter(order => order.status === 'scheduled').length;
    const pendingOrders = ordersThisMonth.filter(order => order.status === 'pending').length;
    const canceledOrders = ordersThisMonth.filter(order => order.status === 'canceled').length;
    
    setStats({
      totalRevenue,
      completedOrders,
      scheduledOrders,
      pendingOrders,
      canceledOrders,
    });
    
  }, [orders]);

  const [stats, setStats] = React.useState({
    totalRevenue: 0,
    completedOrders: 0,
    scheduledOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading statistics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Statistics - {format(new Date(), 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <div>
            <h2 className="text-lg font-medium">${stats.totalRevenue.toFixed(2)}</h2>
            <p className="text-sm text-muted-foreground">Revenue this month</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <div>
            <h2 className="text-lg font-medium">{stats.completedOrders}</h2>
            <p className="text-sm text-muted-foreground">Completed orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-4 w-4 text-blue-500" />
          <div>
            <h2 className="text-lg font-medium">{stats.scheduledOrders}</h2>
            <p className="text-sm text-muted-foreground">Scheduled orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-4 w-4 text-yellow-500" />
          <div>
            <h2 className="text-lg font-medium">{stats.pendingOrders}</h2>
            <p className="text-sm text-muted-foreground">Pending orders</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-4 w-4 text-red-500" />
          <div>
            <h2 className="text-lg font-medium">{stats.canceledOrders}</h2>
            <p className="text-sm text-muted-foreground">Canceled orders</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
