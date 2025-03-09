
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
import MainLayout from '@/components/layout/MainLayout';

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

  // Content to be rendered based on loading/error state
  let content;

  // Show loading state
  if (isLoading) {
    content = <OrderDetailsLoading />;
  }
  // Show error state
  else if (error) {
    content = <OrderDetailsError error={error} />;
  }
  // Show not found state
  else if (!order) {
    content = <OrderNotFound orderId={orderId || ''} />;
  }
  // Show order details
  else {
    content = (
      <div className="container py-6">
        <OrderDetailsHeader
          order={order}
          orderId={orderId}
          isEditing={isEditing}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleCancelClick={handleCancelClick}
          handleSaveClick={handleSaveClick}
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
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={confirmDelete}
        />
      </div>
    );
  }

  // Wrap everything in the MainLayout to ensure header and sidebar are present
  return (
    <MainLayout>
      <OrderErrorBoundary>
        {content}
      </OrderErrorBoundary>
    </MainLayout>
  );
}
