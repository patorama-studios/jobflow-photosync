
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileDown } from 'lucide-react';
import { useOrderExport } from '@/hooks/useOrderExport';

interface OrdersHeaderProps {
  view: "list" | "grid";
  onChangeView: (view: "list" | "grid") => void;
  onOpenCreateOrder: () => void;
  orders?: any[];
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = memo(({ 
  view, 
  onChangeView, 
  onOpenCreateOrder,
  orders = []
}) => {
  const { mutate: exportOrders } = useOrderExport();

  const handleExport = () => {
    exportOrders(orders);
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Orders</h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
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
});

OrdersHeader.displayName = 'OrdersHeader';
