
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
import { Loader2, ArrowLeft, Upload, Download, Share, Globe, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DeliverEmailDialog } from '@/components/orders/single/DeliverEmailDialog';

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
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/orders');
  };

  // Handle navigation to production upload
  const handleStartUpload = () => {
    navigate(`/production/upload/${id}`);
  };
  
  // Handle navigation to property website
  const handlePropertyWebsite = () => {
    navigate(`/property/${id}`);
  };
  
  // Handle downloads page navigation
  const handleDownloads = () => {
    navigate(`/downloads?orderId=${id}`);
  };
  
  // Handle sharing functionality
  const handleShare = () => {
    // Create a share link to downloads page
    const shareLink = `${window.location.origin}/downloads?orderId=${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "The share link has been copied to your clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Failed to copy link",
          description: "Please try again.",
          variant: "destructive",
        });
      });
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

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          {/* Improved Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">Order #{order.orderNumber || order.order_number}</h1>
              <p className="text-lg text-gray-600">{order.address}, {order.city}, {order.state} {order.zip}</p>
              <div className="flex items-center text-sm text-gray-500">
                <button 
                  onClick={handleBackClick}
                  className="flex items-center hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>All Orders</span>
                </button>
                <span className="mx-2">&gt;</span>
                <span>Order #{order.orderNumber || order.order_number}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Button 
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleStartUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Start Upload
              </Button>
              <Button 
                variant="outline"
                onClick={handleDownloads}
              >
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </Button>
              <Button 
                variant="outline"
                onClick={handlePropertyWebsite}
              >
                <Globe className="h-4 w-4 mr-2" />
                Property Website
              </Button>
              <Button 
                variant="outline"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline"
                onClick={handleDeliverClick}
              >
                <Send className="h-4 w-4 mr-2" />
                Deliver
              </Button>
            </div>
            
            <Separator className="my-2" />
          </div>
          
          {/* Tabs section - Updated tab labels */}
          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-6"
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
                  value="invoicing" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Invoicing
                </TabsTrigger>
                <TabsTrigger 
                  value="production" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Production &amp; Delivery
                </TabsTrigger>
                <TabsTrigger 
                  value="communication" 
                  className="px-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none h-12"
                >
                  Communication
                </TabsTrigger>
              </TabsList>
            </div>
            
            <Separator className="mb-6 mt-0" />
            
            <TabsContent value="details" className="mt-6">
              <OrderDetailsTab order={order} />
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
          
          <DeliverEmailDialog
            isOpen={isDeliveryDialogOpen}
            onOpenChange={setIsDeliveryDialogOpen}
            order={order}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
