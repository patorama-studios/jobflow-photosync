
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, Edit, FileDown, Trash, RefreshCw } from 'lucide-react';
import { useOrderDetails } from '@/hooks/use-order-details';
import { OrderDetailsHeader } from '@/components/orders/details/OrderDetailsHeader';
import { OrderDetailsTab } from '@/components/orders/details/OrderDetailsTab';
import { OrderActivityTab } from '@/components/orders/details/OrderActivityTab';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    order, 
    isLoading, 
    error, 
    refetch, 
    deleteOrder 
  } = useOrderDetails(orderId || '');
  
  const handleDeleteOrder = async () => {
    await deleteOrder();
    navigate('/orders');
  };
  
  const handleBackClick = () => {
    navigate('/orders');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container p-6 mx-auto space-y-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container p-6 mx-auto">
            <Button 
              variant="ghost" 
              onClick={handleBackClick} 
              className="mb-6 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
            
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-4" />
              <h2 className="text-xl font-semibold">Error Loading Order</h2>
              <p className="text-muted-foreground mt-2">{error || "Order not found"}</p>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
                <Button onClick={handleBackClick}>
                  Return to Orders
                </Button>
              </div>
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container p-6 mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={handleBackClick} 
            className="mb-2 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          
          <OrderDetailsHeader
            order={order}
            onEdit={() => navigate(`/orders/${orderId}/edit`)}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:max-w-md">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <OrderDetailsTab order={order} />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <OrderActivityTab orderId={orderId || ''} />
            </TabsContent>
          </Tabs>
          
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteOrder}
            orderNumber={order.orderNumber || order.order_number || String(order.id)}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
}
