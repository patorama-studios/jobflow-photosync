
import React from 'react';
import { useOrderDetailsView } from '@/hooks/use-order-details-view';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { OrderDetailsLoading } from '@/components/orders/details/OrderDetailsLoading';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';
import { OrderNotFound } from '@/components/orders/details/OrderNotFound';
import { OrderDetailsHeader } from '@/components/orders/details/OrderDetailsHeader';
import { OrderDetailsContent } from '@/components/orders/details/OrderDetailsContent';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';

const OrderDetails = () => {
  const {
    orderId,
    order,
    editedOrder,
    isLoading,
    error,
    isEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  } = useOrderDetailsView();

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsLoading />
        </PageTransition>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsError error={error} />
        </PageTransition>
      </MainLayout>
    );
  }

  if (!order && !isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderNotFound />
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-8">
          {order && (
            <OrderDetailsHeader
              order={order}
              orderId={orderId}
              isEditing={isEditing}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              handleCancelClick={handleCancelClick}
              handleSaveClick={handleSaveClick}
            />
          )}
          
          <OrderDetailsContent
            order={order}
            editedOrder={editedOrder}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
          />

          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={confirmDelete}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderDetails;
