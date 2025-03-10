
import React from 'react';
import { Order } from '@/types/order-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, FileDown, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OrderDetailsHeaderProps {
  order: Order;
  onEdit?: () => void;
  onDelete?: () => void;
  // Add additional props that components are trying to use
  orderId?: string;
  isEditing?: boolean;
  handleEditClick?: () => void;
  handleDeleteClick?: () => void;
  handleCancelClick?: () => void;
  handleSaveClick?: () => Promise<void>;
}

export function OrderDetailsHeader({ 
  order, 
  onEdit, 
  onDelete,
  // Support both old and new prop patterns
  orderId,
  isEditing,
  handleEditClick,
  handleDeleteClick,
  handleCancelClick,
  handleSaveClick
}: OrderDetailsHeaderProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'scheduled':
        return "bg-blue-100 text-blue-800";
      case 'pending':
        return "bg-amber-100 text-amber-800";
      case 'cancelled':
      case 'canceled':
        return "bg-red-100 text-red-800";
      case 'in_progress':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formattedDate = order.scheduledDate 
    ? format(new Date(order.scheduledDate), "MMMM d, yyyy")
    : "Not scheduled";

  // Use provided handlers or fall back to the simpler ones
  const handleEdit = handleEditClick || onEdit;
  const handleDelete = handleDeleteClick || onDelete;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          {order.orderNumber || order.order_number || `Order #${order.id}`}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <p className="text-muted-foreground">
            {formattedDate} {order.scheduledTime || order.scheduled_time}
          </p>
          <Badge 
            variant="outline"
            className={cn("capitalize", getStatusColor(order.status))}
          >
            {order.status}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 self-end sm:self-auto">
        <Button variant="outline" className="flex items-center gap-1">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex items-center gap-1"
              onClick={handleSaveClick}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
