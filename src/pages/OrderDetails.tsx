
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { OrderDetailsHeader } from '@/components/orders/details/OrderDetailsHeader';
import { OrderDetailsContent } from '@/components/orders/details/OrderDetailsContent';
import { OrderDetailsLoading } from '@/components/orders/details/OrderDetailsLoading';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { OrderNotFound } from '@/components/orders/details/OrderNotFound';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderDetailsTab } from '@/components/orders/details/OrderDetailsTab';
import { OrderActivityTab } from '@/components/orders/details/OrderActivityTab';
import { useOrderDetailsView } from '@/hooks/use-order-details-view';

export default function OrderDetails() {
  const { id: orderId } = useParams<{ id: string }>();
  const {
    order,
    isLoading,
    error,
    refetch,
    activeTab,
    setActiveTab,
    isEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleSaveClick,
    handleBackClick,
  } = useOrderDetailsView(orderId || '');

  useEffect(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  // Handle order not found
  if (!isLoading && !error && !order) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderNotFound orderId={orderId || ''} />
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto p-6 space-y-6">
          {isLoading ? (
            <OrderDetailsLoading />
          ) : error ? (
            <OrderDetailsError error={error} onRetry={refetch} />
          ) : (
            order && (
              <>
                <OrderDetailsHeader
                  order={order}
                  isEditing={isEditing}
                  onEdit={handleEditClick}
                  onCancel={handleCancelClick}
                  onSave={handleSaveClick}
                  onDelete={handleDeleteClick}
                  onBack={handleBackClick}
                />

                <Tabs
                  defaultValue="details"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-4"
                >
                  <TabsList>
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <OrderDetailsTab
                      order={order}
                      isEditing={isEditing}
                      onSave={(formData) => handleSaveClick(formData)}
                    />
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <OrderActivityTab orderId={order.id.toString()} />
                  </TabsContent>
                </Tabs>
              </>
            )
          )}

          {/* Delete Confirmation Dialog */}
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            orderNumber={order?.orderNumber || order?.order_number || `#${order?.id}`}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
}
