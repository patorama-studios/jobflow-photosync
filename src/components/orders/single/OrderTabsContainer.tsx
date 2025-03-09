
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from '@/types/order-types';
import { OrderDetailsTab } from './OrderDetailsTab';
import { ProductionTab } from './ProductionTab';
import { CommunicationTab } from './CommunicationTab';
import { InvoicingTab } from './InvoicingTab';
import { RefundRecord } from '@/types/orders';

interface OrderTabsContainerProps {
  order: Order;
  editedOrder: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: string) => void;
  refundsForOrder: RefundRecord[];
  setRefundsForOrder: React.Dispatch<React.SetStateAction<RefundRecord[]>>;
}

export function OrderTabsContainer({
  order,
  editedOrder,
  isEditing,
  onInputChange,
  onStatusChange,
  refundsForOrder,
  setRefundsForOrder
}: OrderTabsContainerProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
        <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <OrderDetailsTab
          order={order}
          editedOrder={editedOrder}
          isEditing={isEditing}
          onInputChange={onInputChange}
          onStatusChange={onStatusChange}
        />
      </TabsContent>
      
      <TabsContent value="production">
        <ProductionTab order={order} />
      </TabsContent>
      
      <TabsContent value="communication">
        <CommunicationTab order={order} />
      </TabsContent>
      
      <TabsContent value="invoicing">
        <InvoicingTab 
          order={order} 
          refundsForOrder={refundsForOrder}
          setRefundsForOrder={setRefundsForOrder}
        />
      </TabsContent>
    </Tabs>
  );
}
