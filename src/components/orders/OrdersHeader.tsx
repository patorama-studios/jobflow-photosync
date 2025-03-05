
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OrderExport } from './OrderExport';
import { Order } from '@/hooks/useSampleOrders';

interface OrdersHeaderProps {
  orders: Order[];
  filteredOrders: Order[];
  isFiltered: boolean;
  onNewOrder: () => void;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({ 
  orders, 
  filteredOrders, 
  isFiltered, 
  onNewOrder 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Orders</h2>
      <div className="flex items-center gap-2">
        <OrderExport 
          orders={filteredOrders} 
          allOrders={orders}
          isFiltered={isFiltered}
        />
        <Button 
          onClick={onNewOrder} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>
    </div>
  );
};
