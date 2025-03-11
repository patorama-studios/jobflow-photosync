
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/card';
import { AllOrdersList } from '@/components/orders/AllOrdersList';
import { OrderFilters } from '@/components/orders/filters/OrderFilters';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, RefreshCw } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/components/ui/use-toast';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orders, isLoading, refetch } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState(orders || []);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  
  const handleCreateOrder = () => {
    setIsCreateOrderOpen(true);
  };
  
  const handleExportOrders = () => {
    toast({
      title: "Exporting orders",
      description: "Your export is being prepared and will download shortly.",
    });
    // Implementation for exporting orders would go here
  };
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing orders",
      description: "Getting the latest order data...",
    });
    refetch();
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">Manage and track all customer orders</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportOrders}
                className="flex items-center gap-1"
              >
                <FileDown className="h-4 w-4" />
                Export
              </Button>
              <Button 
                onClick={handleCreateOrder} 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
          
          <Card className="overflow-hidden">
            <OrderFilters 
              orders={orders || []} 
              onFiltersChange={setFilteredOrders} 
            />
            <AllOrdersList 
              orders={filteredOrders} 
              isLoading={isLoading} 
            />
          </Card>
        </div>
      </PageTransition>
      
      {isCreateOrderOpen && (
        <CreateAppointmentDialog 
          isOpen={isCreateOrderOpen} 
          onClose={() => setIsCreateOrderOpen(false)}
          selectedDate={new Date()} 
          onAppointmentAdded={async () => {
            refetch();
            return true;
          }}
        />
      )}
    </MainLayout>
  );
}
