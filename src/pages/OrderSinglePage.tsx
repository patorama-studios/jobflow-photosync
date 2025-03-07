
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { useOrderDetails } from '@/hooks/use-order-details';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';

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
          {/* Header section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-700">Order #{order.orderNumber}</h1>
                <div className="flex items-center mt-2 text-gray-500">
                  <button 
                    onClick={handleBackClick}
                    className="flex items-center hover:text-primary transition-colors"
                  >
                    <span>All Orders</span>
                  </button>
                  <span className="mx-2">></span>
                  <span>Order #{order.orderNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                  Update Order
                </Button>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Team Members</div>
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white h-8 w-8 bg-green-500" />
                    <Avatar className="border-2 border-white h-8 w-8 bg-blue-700" />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
          </div>
          
          {/* Tabs section */}
          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-2"
          >
            <div className="flex justify-between items-center">
              <TabsList className="h-12 p-0 bg-transparent space-x-8">
                <TabsTrigger 
                  value="details" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger 
                  value="communication" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Communication
                </TabsTrigger>
                <TabsTrigger 
                  value="invoicing" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Invoice
                </TabsTrigger>
                <TabsTrigger 
                  value="production" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Files
                </TabsTrigger>
              </TabsList>
              
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Upload className="h-4 w-4 mr-2" />
                Upload Job
              </Button>
            </div>
            
            <Separator className="mb-6 mt-0" />
            
            <TabsContent value="details" className="mt-6">
              <OrderDetailsTab order={order} />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Activity History</h3>
                <p className="text-gray-500">No recent activity for this order.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="invoicing" className="mt-6">
              <InvoicingTab order={order} />
            </TabsContent>
            
            <TabsContent value="production" className="mt-6">
              <ProductionTab order={order} />
            </TabsContent>
            
            <TabsContent value="communication" className="mt-6">
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
