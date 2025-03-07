
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { useOrderDetails } from '@/hooks/use-order-details';
import { OrderHeader } from '@/components/orders/single/OrderHeader';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const OrderSinglePage = () => {
  const { id } = useParams<{ id: string }>();
  const { order, isLoading, error } = useOrderDetails(id);
  const [activeTab, setActiveTab] = useState('details');
  const [isDelivering, setIsDelivering] = useState(false);

  // Handle deliver action
  const handleDeliver = async () => {
    setIsDelivering(true);
    try {
      // Mock delivery action for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Content delivered successfully!');
    } catch (error) {
      console.error('Error delivering content:', error);
      toast.error('Failed to deliver content. Please try again.');
    } finally {
      setIsDelivering(false);
    }
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
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              <TabsTrigger value="production">Production & Delivery</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
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
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderSinglePage;
