
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Order } from '@/types/orders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from './OrderActions';
import { useNavigate } from 'react-router-dom';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
}

export const OrderTable: React.FC<OrdersTableProps> = memo(({ orders, isLoading = false }) => {
  const navigate = useNavigate();
  
  const handleRowClick = (orderId: string | number) => {
    navigate(`/orders/${orderId}`);
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(order.id)}
            >
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.client}</TableCell>
              <TableCell>
                {order.scheduledDate && 
                  format(new Date(order.scheduledDate), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{order.address}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">
                <OrderActions orderId={order.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OrderTable.displayName = 'OrderTable';
