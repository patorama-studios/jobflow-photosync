
import React, { useEffect } from 'react';
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
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';

export default function OrderSinglePage() {
  const {
    order,
    isLoading,
    error,
    refetch,
    orderId,
    editedOrder,
    refundsForOrder,
    setRefundsForOrder,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    isNewOrder,
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

  if (isNewOrder) {
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
              </div>
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
              isNewOrder={true}
              isEditing={isEditing}
              onEdit={handleEditClick as () => void}
              onCancel={handleCancelClick as () => void}
              onSave={handleSaveClick as () => Promise<void>}
              onDelete={handleDeleteClick}
              onBack={handleBackClick}
            />
            
            <OrderTabsContainer 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isNewOrder={true}
            >
              <OrderDetailsTab 
                order={order}
                editedOrder={editedOrder}
                isEditing={isEditing}
                isNewOrder={true}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
              />
            </OrderTabsContainer>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

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
          <OrderDetailsError 
            error={error} 
            onRetry={refetch}
            isNewOrderPage={orderId === 'new'} 
          />
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
            onEdit={handleEditClick as () => void}
            onCancel={handleCancelClick as () => void}
            onSave={handleSaveClick as () => Promise<void>}
            onDelete={handleDeleteClick}
            onBack={handleBackClick}
          />
          
          <OrderTabsContainer 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <OrderDetailsTab 
              order={order}
              editedOrder={editedOrder}
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
            onConfirm={confirmDelete}
            onOpenChange={setIsDeleteDialogOpen}
            orderNumber={order.orderNumber || `Order #${order.id}`}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
}
