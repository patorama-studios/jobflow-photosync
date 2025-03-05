
import React from 'react';
import { OrderTable } from './OrderTable';
import { OrderFilter } from './OrderFilter';
import { OrderSearch } from './OrderSearch';
import { OrderFilters, OrderFiltersState } from './OrderFilters';
import { Order } from '@/hooks/useSampleOrders';

interface OrdersContentProps {
  orders: Order[];
  todayOrders: Order[];
  thisWeekOrders: Order[];
  filteredRemainingOrders: Order[];
  statusFilter: string;
  isFiltered: boolean;
  totalFilteredCount: number;
  onSearchResults: (results: Order[]) => void;
  onFilterChange: (newFilters: OrderFiltersState) => void;
  onStatusChange: (status: string) => void;
}

export const OrdersContent: React.FC<OrdersContentProps> = ({
  orders,
  todayOrders,
  thisWeekOrders,
  filteredRemainingOrders,
  statusFilter,
  isFiltered,
  totalFilteredCount,
  onSearchResults,
  onFilterChange,
  onStatusChange
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <OrderSearch 
          orders={orders} 
          onSearchResults={onSearchResults} 
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <OrderFilters onFiltersChange={onFilterChange} />
          
          {isFiltered && (
            <div className="text-sm text-muted-foreground">
              Showing {totalFilteredCount} of {orders.length} orders
            </div>
          )}
        </div>
      </div>

      {/* Order Tables */}
      <div className="space-y-4">
        <OrderTable 
          orders={todayOrders} 
          title="Today's Orders" 
          hideIfEmpty
        />
        
        <OrderTable 
          orders={thisWeekOrders} 
          title="This Week's Orders" 
          hideIfEmpty
        />
        
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">All Other Orders ({filteredRemainingOrders.length})</h3>
            <OrderFilter 
              status={statusFilter} 
              onStatusChange={onStatusChange}
            />
          </div>
          <OrderTable 
            orders={filteredRemainingOrders} 
            title="" 
          />
        </div>
      </div>
    </div>
  );
};
