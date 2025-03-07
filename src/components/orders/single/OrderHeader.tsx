
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order-types';
import { Badge } from '@/components/ui/badge';

interface OrderHeaderProps {
  order: Order;
  onDeliver: () => void;
  isDelivering: boolean;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  order, 
  onDeliver,
  isDelivering 
}) => {
  const isDelivered = order.status === 'delivered';
  const fullAddress = [order.address, order.city, order.state, order.zip].filter(Boolean).join(', ');
  
  return (
    <div className="bg-background border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{order.orderNumber || order.order_number}</h1>
            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
          </div>
          <h2 className="text-xl mt-1">{fullAddress}</h2>
          <p className="text-muted-foreground mt-1">
            {order.client} | {order.scheduledDate || order.scheduled_date} {order.scheduledTime || order.scheduled_time}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Download link button */}
          <Button variant="outline" size="sm" asChild>
            <Link to={`/delivery/${order.id}`} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download Page
            </Link>
          </Button>
          
          {/* Property website button */}
          <Button variant="outline" size="sm" asChild>
            <Link to={`/property/${order.id}`} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Property Website
            </Link>
          </Button>
          
          {/* Deliver/Re-deliver button */}
          <Button 
            variant="default" 
            size="sm" 
            onClick={onDeliver}
            disabled={isDelivering}
            className="flex items-center gap-1"
          >
            {isDelivering ? (
              <>
                <span className="animate-spin">⏳</span>
                {isDelivered ? 'Re-delivering...' : 'Delivering...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {isDelivered ? 'Re-deliver Content' : 'Deliver Content'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'default';
    case 'pending':
    case 'scheduled':
      return 'secondary';
    case 'canceled':
      return 'destructive';
    default:
      return 'outline';
  }
}
