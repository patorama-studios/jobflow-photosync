
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { useOrderDetails } from '@/hooks/use-order-details';
import { OrderHeader } from '@/components/orders/single/OrderHeader';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { Loader2, FileText, DollarSign, Camera, MessageSquare, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { Button } from '@/components/ui/button';

const OrderSinglePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const [isDelivering, setIsDelivering] = useState(false);

  // Handle deliver action
  const handleDeliver = async () => {
    setIsDelivering(true);
    try {
      // Mock delivery action for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Content delivered successfully!",
      });
    } catch (error) {
      console.error('Error delivering content:', error);
      toast({
        title: "Error",
        description: "Failed to deliver content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDelivering(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    confirmDelete();
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/orders');
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

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          {/* Back button */}
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <OrderHeader 
            order={order}
            onDeliver={handleDeliver}
            isDelivering={isDelivering}
          />
          
          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Order Details</span>
                <span className="sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger value="invoicing" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Invoicing</span>
                <span className="sm:hidden">Invoicing</span>
              </TabsTrigger>
              <TabsTrigger value="production" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Production & Delivery</span>
                <span className="sm:hidden">Production</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Communication</span>
                <span className="sm:hidden">Comms</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <OrderDetailsTab order={order} />
            </TabsContent>
            
            <TabsContent value="invoicing" className="mt-4">
              <InvoicingTab order={order} />
            </TabsContent>
            
            <TabsContent value="production" className="mt-4">
              <ProductionTab order={order} />
            </TabsContent>
            
            <TabsContent value="communication" className="mt-4">
              <CommunicationTab order={order} />
            </TabsContent>
          </Tabs>
          
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={handleConfirmDelete}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
