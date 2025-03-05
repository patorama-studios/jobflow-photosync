import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  isThisMonth, 
  isThisWeek, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  format,
  addWeeks,
  isSameWeek
} from 'date-fns';
import { DollarSign, TrendingUp, CalendarRange, BarChart3 } from 'lucide-react';
import { Order } from '@/hooks/useSampleOrders';

interface OrderStatsProps {
  orders: Order[];
}

// Custom isNextWeek function since date-fns doesn't export it directly
const isNextWeek = (date: Date): boolean => {
  const nextWeekStart = addWeeks(new Date(), 1);
  return isSameWeek(date, nextWeekStart);
};

export const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const stats = useMemo(() => {
    // Filter for booked or completed orders
    const relevantOrders = orders.filter(o => 
      o.status === 'scheduled' || o.status === 'completed'
    );
    
    // This week's orders
    const thisWeekOrders = relevantOrders.filter(order => 
      isThisWeek(parseISO(order.scheduledDate))
    );
    const thisWeekTotal = thisWeekOrders.reduce((sum, order) => sum + order.price, 0);
    
    // Next week's orders
    const nextWeekOrders = relevantOrders.filter(order => 
      isNextWeek(parseISO(order.scheduledDate))
    );
    const nextWeekTotal = nextWeekOrders.reduce((sum, order) => sum + order.price, 0);
    
    // This month's orders
    const thisMonthOrders = relevantOrders.filter(order => 
      isThisMonth(parseISO(order.scheduledDate))
    );
    const monthlyTotal = thisMonthOrders.reduce((sum, order) => sum + order.price, 0);
    
    // Average order value
    const averageOrderValue = relevantOrders.length > 0 
      ? relevantOrders.reduce((sum, order) => sum + order.price, 0) / relevantOrders.length 
      : 0;
    
    // Current month range for display
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthRange = `${format(monthStart, 'MMM d')} - ${format(monthEnd, 'MMM d, yyyy')}`;
    
    return {
      thisWeekTotal,
      nextWeekTotal,
      monthlyTotal,
      averageOrderValue,
      monthRange
    };
  }, [orders]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.thisWeekTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Projected revenue this week
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Next Week</CardTitle>
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.nextWeekTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Projected revenue next week
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthRange}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Order</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Average order value
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
