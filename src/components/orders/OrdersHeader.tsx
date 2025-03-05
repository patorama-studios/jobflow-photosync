
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OrdersHeaderProps {
  view: "list" | "grid";
  onChangeView: (view: "list" | "grid") => void;
  onOpenCreateOrder: () => void;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({ 
  view, 
  onChangeView, 
  onOpenCreateOrder 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Orders</h2>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onOpenCreateOrder} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>
    </div>
  );
};
