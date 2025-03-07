
import React, { memo } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "../OrderActions";
import { Order } from "@/types/order-types";

interface OrderRowProps {
  order: Order;
  onRowClick: (id: string | number) => void;
}

const OrderRow = memo(({ order, onRowClick }: OrderRowProps) => (
  <TableRow 
    className="cursor-pointer hover:bg-accent/50"
    onClick={() => onRowClick(order.orderNumber || order.order_number || order.id)}
  >
    <TableCell>{order.orderNumber || order.order_number}</TableCell>
    <TableCell>{order.client}</TableCell>
    <TableCell>{new Date(order.scheduledDate || order.scheduled_date).toLocaleDateString()}</TableCell>
    <TableCell>${order.price?.toFixed(2)}</TableCell>
    <TableCell>
      <Badge variant="secondary">{order.status || "pending"}</Badge>
    </TableCell>
    <TableCell 
      className="text-right"
      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on actions
    >
      <OrderActions 
        orderId={order.id.toString()}
        orderNumber={order.orderNumber || order.order_number}
      />
    </TableCell>
  </TableRow>
));

OrderRow.displayName = 'OrderRow';

export default OrderRow;
