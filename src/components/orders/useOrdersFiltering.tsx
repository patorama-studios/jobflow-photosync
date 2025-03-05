
import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { OrderFiltersState } from './OrderFilters';
import { format, startOfDay, endOfDay, isAfter, isBefore, isEqual, addDays, parseISO } from 'date-fns';

export function useOrdersFiltering(orders: Order[]) {
  const [searchResults, setSearchResults] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filters, setFilters] = useState<OrderFiltersState>({
    status: [],
    sortDirection: 'desc',
    dateRange: {}
  });

  // Apply all filters to orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply date range filter if set
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(order => {
        const orderDate = parseISO(order.date);
        
        if (filters.dateRange.from && filters.dateRange.to) {
          return (
            (isAfter(orderDate, startOfDay(filters.dateRange.from)) || isEqual(orderDate, filters.dateRange.from)) &&
            (isBefore(orderDate, endOfDay(filters.dateRange.to)) || isEqual(orderDate, filters.dateRange.to))
          );
        }
        
        if (filters.dateRange.from) {
          return isAfter(orderDate, startOfDay(filters.dateRange.from)) || isEqual(orderDate, filters.dateRange.from);
        }
        
        if (filters.dateRange.to) {
          return isBefore(orderDate, endOfDay(filters.dateRange.to)) || isEqual(orderDate, filters.dateRange.to);
        }
        
        return true;
      });
    }

    // Apply status filter if set
    if (filters.status.length > 0) {
      result = result.filter(order => 
        filters.status.includes(order.status.toLowerCase())
      );
    }

    // Apply sort direction
    result.sort((a, b) => {
      if (filters.sortDirection === 'asc') {
        return a.date.localeCompare(b.date);
      } else {
        return b.date.localeCompare(a.date);
      }
    });

    return result;
  }, [orders, filters]);

  // Apply search filter to already filtered orders
  const finalFilteredOrders = useMemo(() => {
    if (searchResults === orders) {
      return filteredOrders;
    }
    
    const searchIds = new Set(searchResults.map(order => order.id));
    return filteredOrders.filter(order => searchIds.has(order.id));
  }, [filteredOrders, searchResults, orders]);

  // Group orders by date categories
  const todayOrders = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return finalFilteredOrders.filter(order => order.date.startsWith(today));
  }, [finalFilteredOrders]);

  const thisWeekOrders = useMemo(() => {
    const today = new Date();
    const weekEnd = addDays(today, 7);
    const todayStr = format(today, 'yyyy-MM-dd');
    
    return finalFilteredOrders.filter(order => {
      const orderDate = parseISO(order.date);
      return !order.date.startsWith(todayStr) && 
             (isAfter(orderDate, today) && isBefore(orderDate, weekEnd));
    });
  }, [finalFilteredOrders]);

  const filteredRemainingOrders = useMemo(() => {
    const today = new Date();
    const weekEnd = addDays(today, 7);
    
    return finalFilteredOrders.filter(order => {
      const orderDate = parseISO(order.date);
      return isAfter(orderDate, weekEnd) || isBefore(orderDate, today);
    });
  }, [finalFilteredOrders]);

  const isFiltered = filters.status.length > 0 || 
                     filters.dateRange.from !== undefined || 
                     filters.dateRange.to !== undefined || 
                     searchResults !== orders;

  // Handlers
  const handleSearchResults = (results: Order[]) => {
    setSearchResults(results);
  };

  const handleFilterChange = (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
  };

  return {
    statusFilter,
    setStatusFilter,
    todayOrders,
    thisWeekOrders,
    filteredRemainingOrders,
    totalFilteredCount: finalFilteredOrders.length,
    allFilteredOrders: finalFilteredOrders,
    isFiltered,
    handleSearchResults,
    handleFilterChange
  };
}
