
import React from 'react';
import { Order } from '@/types/order-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Save, Trash, X } from 'lucide-react';

export interface OrderSinglePageHeaderProps {
  order: Order;
  isEditing: boolean;
  onBack: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
}

export function OrderSinglePageHeader({
  order,
  isEditing,
  onBack,
  onEdit,
  onCancel,
  onSave,
  onDelete
}: OrderSinglePageHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
      <div>
        <Button 
          variant="ghost" 
          className="mb-2 flex items-center gap-1 -ml-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">
          {order.orderNumber || `Order #${order.id}`}
        </h1>
        <p className="text-muted-foreground">
          {order.scheduledDate} {order.scheduledTime}
        </p>
      </div>
      
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="default" onClick={onSave}>
              <Save className="mr-1 h-4 w-4" />
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
