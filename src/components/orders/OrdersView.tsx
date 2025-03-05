
import React, { useState } from 'react';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { Button } from '@/components/ui/button';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderStats } from './OrderStats';
import { OrdersHeader } from './OrdersHeader';
import { OrdersContent } from './OrdersContent';
import { useOrdersFiltering } from './useOrdersFiltering';

export const OrdersView: React.FC = () => {
  const { orders } = useSampleOrders();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    statusFilter,
    setStatusFilter,
    todayOrders,
    thisWeekOrders,
    filteredRemainingOrders,
    totalFilteredCount,
    allFilteredOrders,
    isFiltered,
    handleSearchResults,
    handleFilterChange
  } = useOrdersFiltering(orders);

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Create New Order</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Back to Orders
          </Button>
        </div>
        <CreateOrderForm onComplete={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <OrderStats orders={orders} />
      
      {/* Header with New Order button */}
      <OrdersHeader 
        orders={orders}
        filteredOrders={allFilteredOrders}
        isFiltered={isFiltered}
        onNewOrder={() => setShowCreateForm(true)}
      />

      {/* Order Content */}
      <OrdersContent 
        orders={orders}
        todayOrders={todayOrders}
        thisWeekOrders={thisWeekOrders}
        filteredRemainingOrders={filteredRemainingOrders}
        statusFilter={statusFilter}
        isFiltered={isFiltered}
        totalFilteredCount={totalFilteredCount}
        onSearchResults={handleSearchResults}
        onFilterChange={handleFilterChange}
        onStatusChange={setStatusFilter}
      />
    </div>
  );
};
