
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

interface OrdersTableProps {
  orders: Order[];
  onRowClick: (id: string | number) => void;
}

const OrdersTable = memo(({ orders, onRowClick }: OrdersTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
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
            <td colSpan={6} className="text-center py-6 px-4">
              No orders found
            </td>
          </tr>
        )}
      </TableBody>
      <OrderTableFooter count={orders.length} />
    </Table>
  );
});

OrdersTable.displayName = 'OrdersTable';

export default OrdersTable;
