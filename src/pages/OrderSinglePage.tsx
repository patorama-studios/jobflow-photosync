
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrderDetails } from '@/hooks/use-order-details';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';
import { OrderDetailsLoading } from '@/components/orders/details/OrderDetailsLoading';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';
import { OrderNotFound } from '@/components/orders/details/OrderNotFound';
import { OrderSinglePageHeader } from '@/components/orders/single/OrderSinglePageHeader';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { toast } from 'sonner';

const OrderSinglePage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { setTitle, setShowBackButton, setBackButtonAction } = useHeaderSettings();
  
  const { 
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
  } = useOrderDetails(orderId);

  useEffect(() => {
    // Set header title and back button
    if (!isLoading && order) {
      setTitle(`Order ${order.orderNumber || order.order_number || orderId}`);
    } else {
      setTitle('Order Details');
    }
    
    setShowBackButton(true);
    setBackButtonAction(() => () => navigate('/orders'));
    
    // Clean up when component unmounts
    return () => {
      setTitle(null);
      setShowBackButton(false);
      setBackButtonAction(undefined);
    };
  }, [order, orderId, isLoading, setTitle, setShowBackButton, setBackButtonAction, navigate]);

  // For debugging
  useEffect(() => {
    console.log("OrderSinglePage rendering with order:", order);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [order, isLoading, error]);

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
              <OrderDetailsTab 
                order={order}
                editedOrder={editedOrder}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="invoicing" className="mt-6">
              <InvoicingTab 
                order={order}
                refundsForOrder={refundsForOrder}
                setRefundsForOrder={setRefundsForOrder}
              />
            </TabsContent>
            
            <TabsContent value="production" className="mt-6">
              <ProductionTab order={order} />
            </TabsContent>
            
            <TabsContent value="communication" className="mt-6">
              <CommunicationTab order={order} />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
