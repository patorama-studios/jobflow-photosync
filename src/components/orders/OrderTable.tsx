
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type OrderTableProps = {
  orders: Order[];
  title: string;
  hideIfEmpty?: boolean;
};

export const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  title,
  hideIfEmpty = false
}) => {
  const navigate = useNavigate();

  if (hideIfEmpty && orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {title && <h3 className="text-lg font-medium">{title} ({orders.length})</h3>}
      
      {orders.length === 0 ? (
        <div className="bg-muted/30 p-4 rounded-md text-center">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Property Address</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'scheduled' ? 'secondary' : 'outline'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(order.scheduledDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
