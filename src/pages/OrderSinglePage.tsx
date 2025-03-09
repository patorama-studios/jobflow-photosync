
import React, { useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrderDetailsView } from '@/hooks/use-order-details-view';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';
import { OrderDetailsLoading } from '@/components/orders/details/OrderDetailsLoading';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';
import { OrderNotFound } from '@/components/orders/details/OrderNotFound';
import { OrderSinglePageHeader } from '@/components/orders/single/OrderSinglePageHeader';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const OrderSinglePage = () => {
  console.log("OrderSinglePage rendering, params:", useParams());
  
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
    confirmDelete,
    refundsForOrder,
    setRefundsForOrder
  } = useOrderDetailsView();

  // For debugging
  useEffect(() => {
    console.log("OrderSinglePage rendering with order:", order);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
    console.log("Current route:", window.location.pathname);
  }, [order, isLoading, error]);

  // Add a fallback for when orderId is not available
  if (!orderId) {
    console.error("OrderSinglePage: No order ID provided in URL params");
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsError error="No order ID provided in URL" />
        </PageTransition>
      </MainLayout>
    );
  }

  if (isLoading) {
    console.log("OrderSinglePage: Showing loading state");
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsLoading />
        </PageTransition>
      </MainLayout>
    );
  }

  if (error) {
    console.error("OrderSinglePage: Error loading order:", error);
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsError error={error} />
        </PageTransition>
      </MainLayout>
    );
  }

  if (!order && !isLoading) {
    console.log("OrderSinglePage: Order not found for ID:", orderId);
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
        <ErrorBoundary>
          <div className="container py-6 max-w-7xl">
            {order && (
              <OrderSinglePageHeader
                order={order}
                orderId={orderId}
                isEditing={isEditing}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleCancelClick={handleCancelClick}
                handleSaveClick={handleSaveClick}
              />
            )}
            
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
                <TabsTrigger value="production">Production & Delivery</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <Suspense fallback={<OrderDetailsLoading />}>
                  <ErrorBoundary>
                    <OrderDetailsTab 
                      order={order}
                      editedOrder={editedOrder}
                      isEditing={isEditing}
                      onInputChange={handleInputChange}
                      onStatusChange={handleStatusChange}
                    />
                  </ErrorBoundary>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="invoicing" className="mt-6">
                <Suspense fallback={<OrderDetailsLoading />}>
                  <ErrorBoundary>
                    <InvoicingTab 
                      order={order}
                      refundsForOrder={refundsForOrder}
                      setRefundsForOrder={setRefundsForOrder}
                    />
                  </ErrorBoundary>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="production" className="mt-6">
                <Suspense fallback={<OrderDetailsLoading />}>
                  <ErrorBoundary>
                    <ProductionTab order={order} />
                  </ErrorBoundary>
                </Suspense>
              </TabsContent>
              
              <TabsContent value="communication" className="mt-6">
                <Suspense fallback={<OrderDetailsLoading />}>
                  <ErrorBoundary>
                    <CommunicationTab order={order} />
                  </ErrorBoundary>
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </ErrorBoundary>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
