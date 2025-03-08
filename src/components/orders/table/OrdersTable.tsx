
import React, { memo } from 'react';
import { 
  Table, 
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import { Order } from "@/types/order-types";
import TableHeader from './TableHeader';
import OrderTableFooter from './TableFooter';
import OrderRow from './OrderRow';
import { AlertCircle } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  onRowClick: (id: string | number) => void;
}

const OrdersTable = memo(({ orders, onRowClick }: OrdersTableProps) => {
  return (
    <div className="w-full overflow-auto">
      <Table className="border-collapse table-fixed w-full">
        <TableHeader />
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderRow 
                key={order.id} 
                order={order} 
                onRowClick={onRowClick} 
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground py-6">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                  <p>No orders found</p>
                  <p className="text-sm">Try adjusting your filters or create a new order</p>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
        <OrderTableFooter count={orders.length} />
      </Table>
    </div>
  );
});

OrdersTable.displayName = 'OrdersTable';

export default OrdersTable;
