
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { OrderActions } from "@/components/orders/OrderActions";
import { Order } from "@/types/order-types";

interface OrderRowProps {
  order: Order;
  onRowClick: (id: string | number) => void;
}

const OrderRow = ({ order, onRowClick }: OrderRowProps) => {
  const navigate = useNavigate();
  
  // Format date if it exists, otherwise show placeholder
  const formattedDate = order.scheduledDate 
    ? format(new Date(order.scheduledDate), "MMM d, yyyy")
    : "Not scheduled";
  
  // Handle different status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'scheduled':
        return "bg-blue-100 text-blue-800";
      case 'pending':
        return "bg-amber-100 text-amber-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle row click with proper navigation
  const handleRowClick = (e: React.MouseEvent) => {
    // Only trigger if the click wasn't on a button or action element
    if (!(e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      navigate(`/orders/${order.id}`);
    }
  };

  return (
    <TableRow 
      className="hover:bg-muted/50 cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell className="font-medium">
        {order.orderNumber || order.order_number || `#${order.id.toString().slice(0, 8)}`}
      </TableCell>
      <TableCell>
        {order.customerName || order.client || "Unknown Client"}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          <span className="text-xs text-muted-foreground">{order.scheduledTime || order.scheduled_time}</span>
        </div>
      </TableCell>
      <TableCell>
        {order.propertyAddress || order.address || "No address provided"}
      </TableCell>
      <TableCell>
        {order.state || "N/A"}
      </TableCell>
      <TableCell className="text-right">
        <OrderActions 
          orderId={order.id.toString()} 
          orderNumber={order.orderNumber || order.order_number}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
