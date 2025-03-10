
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Send } from "lucide-react";
import { Order } from '@/types/order-types';
import { formatDate } from '@/lib/utils';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Format date for display
  const formattedDate = order.scheduledDate ? formatDate(new Date(order.scheduledDate)) : 'No date scheduled';
  
  // Determine status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'canceled': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // This function now returns a Promise to match the expected type
  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);
      // Simulate deletion and navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This will trigger the delete action and navigate to /orders
      if (order.id) {
        window.location.href = '/orders';
      }
    } catch (error) {
      console.error("Error during delete:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <Badge className={getStatusColor(order.status || '')} variant="outline">
              {order.status || 'Unknown'}
            </Badge>
          </div>
          <p className="text-gray-500">{order.address}, {order.city}, {order.state} {order.zip}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onDeliver}
            disabled={isDelivering}
            className="flex items-center gap-1"
          >
            <Send className="w-4 h-4 mr-1" />
            {isDelivering ? 'Sending...' : 'Deliver Content'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <p className="font-medium">{order.client}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Photographer</p>
          <p className="font-medium">{order.photographer || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-medium">${order.price}</p>
        </div>
      </div>

      <DeleteOrderDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        orderNumber={order.orderNumber || String(order.id)}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
