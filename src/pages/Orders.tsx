
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { OrdersView } from '@/components/orders/OrdersView';
import { Routes, Route } from 'react-router-dom';
import OrderDetails from './OrderDetails';

const Orders: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <SidebarLayout>
          <PageTransition>
            <div className="container mx-auto py-6">
              <h1 className="text-3xl font-semibold mb-6">Orders & Appointments</h1>
              <OrdersView />
            </div>
          </PageTransition>
        </SidebarLayout>
      } />
      <Route path=":orderId" element={<OrderDetails />} />
    </Routes>
  );
};

export default Orders;
