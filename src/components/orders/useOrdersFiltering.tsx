
import { useState, useMemo } from 'react';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
import { OrderFiltersState } from './filters/types';

export const useOrdersFiltering = (orders: Order[]) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<OrderFiltersState>({
    sortDirection: 'desc',
  });
  
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
  
  // Only recompute when orders change, not on every render
  const filteredOrders = useMemo(() => {
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
      filteredRemainingOrders: filtered,
      totalFilteredCount: today.length + thisWeek.length + filtered.length,
      allFilteredOrders: [...today, ...thisWeek, ...filtered]
    };
  }, [orders, statusFilter, searchResults, isSearching, advancedFilters]);
  
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
  const isFiltered = useMemo(() => {
    return isSearching || statusFilter !== 'all' || 
           Object.keys(advancedFilters).some(key => 
             key !== 'sortDirection' && Boolean(advancedFilters[key as keyof OrderFiltersState])
           );
  }, [isSearching, statusFilter, advancedFilters]);

  return {
    statusFilter,
    setStatusFilter,
    isFiltered,
    ...filteredOrders,
    handleSearchResults,
    handleFilterChange
  };
};
