
import React from 'react';
import { OrderErrorBoundary } from '@/components/orders/debug/OrderErrorBoundary';
import { useOrderDetailsView } from '@/hooks/use-order-details-view';
import { OrderDetailsHeader } from '@/components/orders/details/OrderDetailsHeader';
import { OrderDetailsContent } from '@/components/orders/details/OrderDetailsContent';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { RefundsSection } from '@/components/orders/details/RefundsSection';
import { ContractorsSection } from '@/components/orders/details/ContractorsSection';
import { OrderDetailsLoading } from '@/components/orders/details/OrderDetailsLoading';
import { OrderNotFound } from '@/components/orders/details/OrderNotFound';

export default function OrderSinglePage() {
  // Use our custom hook to handle all the order details logic
  const {
    orderId,
    order,
    editedOrder,
    isLoading,
    error,
    isEditing,
    isDeleteDialogOpen,
    refundsForOrder,
    setRefundsForOrder,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete,
    navigate
  } = useOrderDetailsView();

  // Show loading state
  if (isLoading) {
    return <OrderDetailsLoading />;
  }

  // Show error state
  if (error) {
    return <OrderDetailsError error={error} />;
  }

  // Show not found state
  if (!order) {
    return <OrderNotFound orderId={orderId} />;
  }

  return (
    <OrderErrorBoundary>
      <div className="container py-6">
        <OrderDetailsHeader
          order={order}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelClick={handleCancelClick}
          onSaveClick={handleSaveClick}
          onDeleteClick={handleDeleteClick}
        />

        <div className="mt-6">
          <OrderDetailsContent
            order={order}
            editedOrder={editedOrder}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div className="mt-8">
          <RefundsSection 
            order={order} 
            refundsForOrder={refundsForOrder}
            setRefundsForOrder={setRefundsForOrder}
          />
        </div>

        <div className="mt-8">
          <ContractorsSection order={order} />
        </div>

        <DeleteOrderDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </OrderErrorBoundary>
  );
}
