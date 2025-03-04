
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { OrdersView } from '@/components/orders/OrdersView';

const Orders: React.FC = () => {
  return (
    <SidebarLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-semibold mb-6">Orders & Appointments</h1>
          <OrdersView />
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Orders;
