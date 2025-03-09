
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from '@/types/order-types';
import { Button } from "@/components/ui/button";
import { useOrderDetailsView } from '@/hooks/use-order-details-view';
import { PageTransition } from '@/components/layout/PageTransition';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { OrderDetailsHeader } from '@/components/orders/details/OrderDetailsHeader';
import { OrderTabsContainer } from '@/components/orders/single/OrderTabsContainer';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

// Loading state component
const OrderLoading = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    <Card>
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </Card>
  </div>
);

// Error state component
const OrderError = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center">
    <AlertCircle className="h-10 w-10 text-destructive mb-4" />
    <h2 className="text-xl font-semibold">Error Loading Order</h2>
    <p className="text-muted-foreground mt-2">{message}</p>
    <Button className="mt-6" variant="outline" onClick={() => window.location.reload()}>
      Try Again
    </Button>
  </div>
);

export default function OrderSinglePage() {
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

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderLoading />
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderError message={error || "Order not found"} />
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="py-6">
          <OrderDetailsHeader
            order={order}
            orderId={orderId}
            isEditing={isEditing}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleCancelClick={handleCancelClick}
            handleSaveClick={handleSaveClick}
          />

          <OrderTabsContainer 
            order={order}
            editedOrder={editedOrder}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onStatusChange={handleStatusChange}
            refundsForOrder={refundsForOrder}
            setRefundsForOrder={setRefundsForOrder}
          />

          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={confirmDelete}
            isDeleting={false}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
}
