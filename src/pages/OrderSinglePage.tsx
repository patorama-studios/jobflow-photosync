
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { OrderSinglePageHeader } from '@/components/orders/single/OrderSinglePageHeader';
import { OrderTabsContainer } from '@/components/orders/single/OrderTabsContainer';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderSinglePage } from '@/hooks/use-order-single-page';

export default function OrderSinglePage() {
  const {
    order,
    isLoading,
    error,
    orderId,
    editedOrder,
    refundsForOrder,
    setRefundsForOrder,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    handleDeleteClick,
    confirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick,
    handleInputChange,
    handleStatusChange,
    navigate,
  } = useOrderSinglePage();

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container p-6 mx-auto">
            <Skeleton className="h-12 w-60 mb-6" />
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-8" />
            
            <Skeleton className="h-10 w-full mb-8" />
            
            <div className="space-y-10">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container p-6 mx-auto text-center py-20">
            <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Order</h2>
            <p className="text-muted-foreground mb-8">{error || "The order could not be found or has been deleted."}</p>
            <Button onClick={handleBackClick}>Return to Orders</Button>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container p-6 mx-auto">
          <OrderSinglePageHeader 
            order={order}
            isEditing={isEditing}
            onEdit={handleEditClick}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
            onDelete={handleDeleteClick}
            onBack={handleBackClick}
          />
          
          <OrderTabsContainer 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <OrderDetailsTab 
              order={editedOrder || order}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onStatusChange={handleStatusChange}
            />
            <InvoicingTab 
              order={order}
              refunds={refundsForOrder}
              setRefunds={setRefundsForOrder}
            />
            <ProductionTab 
              order={order}
            />
            <CommunicationTab 
              order={order}
            />
          </OrderTabsContainer>
          
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => {}}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={confirmDelete}
            orderNumber={order.orderNumber || `Order #${order.id}`}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
}
