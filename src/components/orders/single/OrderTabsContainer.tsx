
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types/order-types';
import { OrderDetailsTab } from '@/components/orders/single/OrderDetailsTab';
import { InvoicingTab } from '@/components/orders/single/InvoicingTab';
import { ProductionTab } from '@/components/orders/single/ProductionTab';
import { CommunicationTab } from '@/components/orders/single/CommunicationTab';
import { useNavigate, useParams } from 'react-router-dom';
import { RefundRecord } from '@/types/orders';

interface OrderTabsContainerProps {
  order: Order | null;
}

export const OrderTabsContainer: React.FC<OrderTabsContainerProps> = ({ order }) => {
  const navigate = useNavigate();
  const { orderId, tab = 'details' } = useParams<{ orderId: string; tab?: string }>();
  const [refundsForOrder, setRefundsForOrder] = useState<RefundRecord[]>([]);
  
  // For demo purposes, set some mock refunds
  React.useEffect(() => {
    if (order) {
      setRefundsForOrder([
        {
          id: 'ref-1',
          amount: 25.00,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          reason: 'Partial refund requested by client',
          isFullRefund: false,
          status: 'completed',
          stripeRefundId: 're_123456789'
        }
      ]);
    }
  }, [order]);

  const handleTabChange = (value: string) => {
    navigate(`/orders/${orderId}/${value}`);
  };

  return (
    <Tabs defaultValue={tab} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="details">Order Details</TabsTrigger>
        <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <OrderDetailsTab 
          order={order}
          editedOrder={order}
          isEditing={false}
          onInputChange={() => {}}
          onStatusChange={() => {}}
        />
      </TabsContent>
      
      <TabsContent value="invoicing">
        <InvoicingTab 
          order={order}
          refundsForOrder={refundsForOrder}
          setRefundsForOrder={setRefundsForOrder}
        />
      </TabsContent>
      
      <TabsContent value="production">
        <ProductionTab order={order} />
      </TabsContent>
      
      <TabsContent value="communication">
        <CommunicationTab order={order} />
      </TabsContent>
    </Tabs>
  );
};
