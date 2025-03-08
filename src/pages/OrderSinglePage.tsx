
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { useOrderDetails } from '@/hooks/use-order-details';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { DeliverEmailDialog } from '@/components/orders/single/DeliverEmailDialog';
import { OrderSinglePageHeader } from '@/components/orders/single/OrderSinglePageHeader';
import { OrderActionButtons } from '@/components/orders/single/OrderActionButtons';
import { OrderTabsContainer } from '@/components/orders/single/OrderTabsContainer';

const OrderSinglePage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Order ID from params:", id);
  
  const { 
    order, 
    isLoading, 
    error, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    handleDeleteClick, 
    confirmDelete 
  } = useOrderDetails(id);
  
  const [activeTab, setActiveTab] = useState('details');
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);

  // Format order number - remove "ORD-" prefix
  const formatOrderNumber = (orderNumber: string) => {
    if (orderNumber?.startsWith('ORD-')) {
      return `#${orderNumber.substring(4)}`;
    }
    return `#${orderNumber}`;
  };

  // Handle delivery email dialog
  const handleDeliverClick = () => {
    setIsDeliveryDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    confirmDelete();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading order details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Order</h2>
          <p className="text-gray-600">{error || 'Order not found'}</p>
        </div>
      </MainLayout>
    );
  }

  // Make a copy of the order with the formatted order number
  const formattedOrder = {
    ...order,
    orderNumber: formatOrderNumber(order.orderNumber || order.order_number || ''),
    order_number: formatOrderNumber(order.orderNumber || order.order_number || '')
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <OrderSinglePageHeader order={formattedOrder} />
            
            <OrderActionButtons 
              order={formattedOrder} 
              onDeliverClick={handleDeliverClick} 
            />
            
            <Separator className="my-2" />
          </div>
          
          {/* Tabs section */}
          <OrderTabsContainer 
            order={formattedOrder}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={handleConfirmDelete}
          />
          
          <DeliverEmailDialog
            isOpen={isDeliveryDialogOpen}
            onOpenChange={setIsDeliveryDialogOpen}
            order={formattedOrder}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
