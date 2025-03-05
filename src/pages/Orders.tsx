
import React, { lazy, Suspense, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { OrdersView } from '@/components/orders/OrdersView';

// Lazy load the OrderDetails component
const OrderDetails = lazy(() => import('./OrderDetails'));

// Loading fallback for order details
const OrderDetailsLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="animate-pulse text-primary">Loading order details...</div>
  </div>
);

const OrdersPage = memo(() => {
  return (
    <Routes>
      <Route path="/" element={
        <PageTransition>
          <div className="container mx-auto py-6">
            <h1 className="text-3xl font-semibold mb-6">Orders & Appointments</h1>
            <OrdersView />
          </div>
        </PageTransition>
      } />
      <Route path=":orderId" element={
        <Suspense fallback={<OrderDetailsLoader />}>
          <OrderDetails />
        </Suspense>
      } />
    </Routes>
  );
});

OrdersPage.displayName = 'OrdersPage';
export default OrdersPage;
