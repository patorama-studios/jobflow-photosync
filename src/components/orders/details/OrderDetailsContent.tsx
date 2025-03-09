
import React from 'react';
import { Order } from "@/types/order-types";
import { OrderInformation } from '@/components/orders/details/OrderInformation';
import { ClientInformation } from '@/components/orders/details/ClientInformation';
import { PhotographerInformation } from '@/components/orders/details/PhotographerInformation';
import { OrderNotes } from '@/components/orders/details/OrderNotes';

interface OrderDetailsContentProps {
  order: Order | null;
  editedOrder: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: string) => void;
}

export const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({
  order,
  editedOrder,
  isEditing,
  onInputChange,
  onStatusChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <OrderInformation 
        order={isEditing ? editedOrder : order} 
        isEditing={isEditing}
        onInputChange={onInputChange}
        onStatusChange={onStatusChange}
      />
      
      <ClientInformation 
        order={isEditing ? editedOrder : order} 
        isEditing={isEditing}
        onInputChange={onInputChange}
      />
      
      <PhotographerInformation 
        order={isEditing ? editedOrder : order} 
        isEditing={isEditing}
        onInputChange={onInputChange}
      />
      
      <OrderNotes 
        order={isEditing ? editedOrder : order} 
        isEditing={isEditing}
        onInputChange={onInputChange}
      />
    </div>
  );
};
