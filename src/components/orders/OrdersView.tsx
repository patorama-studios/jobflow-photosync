
import React, { useState, useMemo, useEffect } from 'react';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import { OrderTable } from './OrderTable';
import { OrderFilter } from './OrderFilter';
import { useSampleOrders, Order } from '@/hooks/useSampleOrders';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderStats } from './OrderStats';
import { OrderSearch } from './OrderSearch';
import { OrderFilters, OrderFiltersState } from './OrderFilters';
import { OrderExport } from './OrderExport';

export const OrdersView: React.FC = () => {
  const { orders } = useSampleOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // New state for advanced filtering
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<OrderFiltersState>({
    sortDirection: 'desc',
  });
  
  // Only recompute when orders change, not on every render
  const { todayOrders, thisWeekOrders, filteredRemainingOrders } = useMemo(() => {
    // Determine which orders to filter
    const ordersToFilter = isSearching ? searchResults : orders;
    
    // Filter orders by date
    const today = ordersToFilter.filter(order => isToday(parseISO(order.scheduledDate)));
    
    const thisWeek = ordersToFilter.filter(order => 
      isThisWeek(parseISO(order.scheduledDate)) && 
      !isToday(parseISO(order.scheduledDate))
    );

    // Filter remaining orders by status
    const remaining = ordersToFilter.filter(order => 
      !isToday(parseISO(order.scheduledDate)) && 
      !isThisWeek(parseISO(order.scheduledDate))
    );

    // Apply basic status filter
    let filtered = remaining;
    if (statusFilter !== 'all') {
      if (statusFilter === 'outstanding') {
        filtered = remaining.filter(order => order.status !== 'completed');
      } else {
        filtered = remaining.filter(order => order.status === statusFilter);
      }
    }
    
    // Apply advanced filters
    filtered = applyAdvancedFilters(filtered, advancedFilters);

    return {
      todayOrders: today,
      thisWeekOrders: thisWeek,
      filteredRemainingOrders: filtered
    };
  }, [orders, statusFilter, searchResults, isSearching, advancedFilters]);
  
  // Apply advanced filters
  const applyAdvancedFilters = (ordersToFilter: Order[], filters: OrderFiltersState) => {
    let result = [...ordersToFilter];
    
    // Date Range Created filter
    if (filters.dateRangeCreated?.from || filters.dateRangeCreated?.to) {
      // Note: In a real app, this would filter based on creation date
      // For this demo, we're using scheduledDate as a proxy
      result = result.filter(order => {
        const orderDate = parseISO(order.scheduledDate);
        if (filters.dateRangeCreated?.from && orderDate < filters.dateRangeCreated.from) {
          return false;
        }
        if (filters.dateRangeCreated?.to && orderDate > filters.dateRangeCreated.to) {
          return false;
        }
        return true;
      });
    }
    
    // Appointment Date Range filter
    if (filters.appointmentDateRange?.from || filters.appointmentDateRange?.to) {
      result = result.filter(order => {
        const appointmentDate = parseISO(order.scheduledDate);
        if (filters.appointmentDateRange?.from && appointmentDate < filters.appointmentDateRange.from) {
          return false;
        }
        if (filters.appointmentDateRange?.to && appointmentDate > filters.appointmentDateRange.to) {
          return false;
        }
        return true;
      });
    }
    
    // Order Status filter (overrides the basic filter)
    if (filters.orderStatus && filters.orderStatus !== 'all') {
      result = result.filter(order => order.status === filters.orderStatus);
    }
    
    // Payment Status filter
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      // For demo purposes, we'll just use a simple mapping
      const paymentStatusMap: Record<string, boolean> = {
        'paid': true,
        'unpaid': false,
        'pending': false
      };
      
      result = result.filter(order => {
        // Since we don't have a real payment status field, use price as a proxy
        // This is just for demonstration purposes
        const isPaid = order.price > 300; // arbitrary condition
        return filters.paymentStatus === 'paid' ? isPaid : !isPaid;
      });
    }
    
    // Sort Direction
    result.sort((a, b) => {
      const dateA = new Date(a.scheduledDate).getTime();
      const dateB = new Date(b.scheduledDate).getTime();
      return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return result;
  };
  
  // Handle search results
  const handleSearchResults = (results: Order[]) => {
    setSearchResults(results);
    setIsSearching(results.length !== orders.length);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: OrderFiltersState) => {
    setAdvancedFilters(newFilters);
  };
  
  // Calculate if content is filtered
  const isFiltered = isSearching || statusFilter !== 'all' || 
                    Object.keys(advancedFilters).some(key => 
                      key !== 'sortDirection' && Boolean(advancedFilters[key as keyof OrderFiltersState])
                    );
  
  // Total filtered orders count
  const totalFilteredCount = todayOrders.length + thisWeekOrders.length + filteredRemainingOrders.length;

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <div className="flex items-center gap-2">
          <OrderExport 
            orders={[...todayOrders, ...thisWeekOrders, ...filteredRemainingOrders]} 
            allOrders={orders}
            isFiltered={isFiltered}
          />
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <OrderSearch 
          orders={orders} 
          onSearchResults={handleSearchResults} 
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <OrderFilters onFiltersChange={handleFilterChange} />
          
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
              onStatusChange={setStatusFilter}
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
