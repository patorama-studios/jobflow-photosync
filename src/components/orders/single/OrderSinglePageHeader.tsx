
import React from 'react';
import { Order } from '@/types/order-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Save, X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderSinglePageHeaderProps {
  order: Order | null;
  isEditing: boolean;
  isNewOrder?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function OrderSinglePageHeader({
  order,
  isEditing,
  isNewOrder = false,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onBack
}: OrderSinglePageHeaderProps) {
  if (!order) return null;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 p-0 h-8 w-8" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewOrder ? 'Create New Order' : order.orderNumber || `Order #${order.id}`}
        </h1>
        {!isNewOrder && !isEditing && (
          <Badge 
            variant="outline" 
            className={`ml-3 ${getStatusColor(order.status)}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          {!isNewOrder && !isEditing && (
            <p className="text-muted-foreground">
              {order.client} • {order.address} • {order.propertyType} • {order.squareFeet} sq ft
            </p>
          )}
          {isNewOrder && (
            <p className="text-muted-foreground">
              Create a new order by filling out the details below
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              {!isNewOrder && (
                <Button variant="destructive" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
