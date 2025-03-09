
import React from 'react';
import { Order } from '@/types/order-types';
import { OrderDetailsContent } from '@/components/orders/details/OrderDetailsContent';

interface OrderDetailsTabProps {
  order: Order;
  editedOrder: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: string) => void;
}

export function OrderDetailsTab({
  order,
  editedOrder,
  isEditing,
  onInputChange,
  onStatusChange
}: OrderDetailsTabProps) {
  return (
    <div className="mt-4">
      <OrderDetailsContent
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        onInputChange={onInputChange}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
