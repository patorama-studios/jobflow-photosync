
import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { OrdersView } from '@/components/orders/OrdersView';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/use-orders';
import { PlusCircle, RefreshCw } from 'lucide-react';

// Lazy load the OrderDetails component
const OrderDetails = lazy(() => import('./OrderDetails'));

// Loading fallback for order details
const OrderDetailsLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="animate-pulse text-primary">Loading order details...</div>
  </div>
);

const OrdersPage = () => {
  const { addDummyOrder, clearAllOrders, refetch } = useOrders();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={
          <PageTransition>
            <div className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Orders & Appointments</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetch()}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addDummyOrder}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Dummy Order
                  </Button>
                </div>
              </div>
              <OrdersView />
            </div>
          </PageTransition>
        } />
        <Route path=":orderId/*" element={
          <Suspense fallback={<OrderDetailsLoader />}>
            <OrderDetails />
          </Suspense>
        } />
      </Routes>
    </MainLayout>
  );
};

export default OrdersPage;
