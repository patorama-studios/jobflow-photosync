
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrdersList } from './OrdersList';
import { CreateOrderForm } from './CreateOrderForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('orders');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="orders" className="w-full" onValueChange={(value) => {
          setActiveTab(value);
          if (value === 'orders') setShowCreateForm(false);
        }}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="orders">All Orders</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </div>
          
          {!showCreateForm ? (
            <>
              <TabsContent value="orders" className="space-y-4">
                <OrdersList filter="all" />
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-4">
                <OrdersList filter="upcoming" />
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <OrdersList filter="completed" />
              </TabsContent>
            </>
          ) : (
            <div className="mt-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Create New Order</h2>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Back to Orders
                </Button>
              </div>
              <CreateOrderForm onComplete={() => {
                setShowCreateForm(false);
                setActiveTab('orders');
              }} />
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};
