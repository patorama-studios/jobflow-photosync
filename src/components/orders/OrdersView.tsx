
import React, { useState, useMemo } from 'react';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import { OrderTable } from './OrderTable';
import { OrderFilter } from './OrderFilter';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateOrderForm } from './CreateOrderForm';

export const OrdersView: React.FC = () => {
  const { orders } = useSampleOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Only recompute when orders change, not on every render
  const { todayOrders, thisWeekOrders, filteredRemainingOrders } = useMemo(() => {
    // Filter orders by date
    const today = orders.filter(order => isToday(parseISO(order.scheduledDate)));
    
    const thisWeek = orders.filter(order => 
      isThisWeek(parseISO(order.scheduledDate)) && 
      !isToday(parseISO(order.scheduledDate))
    );

    // Filter remaining orders by status
    const remaining = orders.filter(order => 
      !isToday(parseISO(order.scheduledDate)) && 
      !isThisWeek(parseISO(order.scheduledDate))
    );

    const filtered = remaining.filter(order => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'outstanding') return order.status !== 'completed';
      return order.status === statusFilter;
    });

    return {
      todayOrders: today,
      thisWeekOrders: thisWeek,
      filteredRemainingOrders: filtered
    };
  }, [orders, statusFilter]);

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Create New Order</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Back to Orders
          </Button>
        </div>
        <CreateOrderForm onComplete={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <Button 
          onClick={() => setShowCreateForm(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="space-y-4">
        <OrderTable 
          orders={todayOrders} 
          title="Today's Orders" 
          hideIfEmpty
        />
        
        <OrderTable 
          orders={thisWeekOrders} 
          title="This Week's Orders" 
          hideIfEmpty
        />
        
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">All Other Orders ({filteredRemainingOrders.length})</h3>
            <OrderFilter 
              status={statusFilter} 
              onStatusChange={setStatusFilter}
            />
          </div>
          <OrderTable 
            orders={filteredRemainingOrders} 
            title="" 
          />
        </div>
      </div>
    </div>
  );
};
