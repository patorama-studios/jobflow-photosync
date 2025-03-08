
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/order-types';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';

interface OrderTabsContainerProps {
  order: Order;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const OrderTabsContainer: React.FC<OrderTabsContainerProps> = ({
  order,
  activeTab,
  setActiveTab
}) => {
  return (
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
  );
};
