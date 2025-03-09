
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order-types";

interface OrderDetailsHeaderProps {
  order: Order;
  orderId: string | undefined;
  isEditing: boolean;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  handleCancelClick: () => void;
  handleSaveClick: () => void;
}

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
  order,
  orderId,
  isEditing,
  handleEditClick,
  handleDeleteClick,
  handleCancelClick,
  handleSaveClick
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Order {order?.orderNumber || order?.order_number || orderId}
        </h1>
        <p className="text-muted-foreground">
          {order?.scheduledDate || order?.scheduled_date 
            ? new Date(order.scheduledDate || order.scheduled_date).toLocaleDateString() 
            : 'No date scheduled'}
          {order?.status && (
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          )}
        </p>
      </div>
      
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button onClick={handleEditClick} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              onClick={handleDeleteClick} 
              variant="destructive" 
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancelClick} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
