
import { useMemo, useState, useCallback } from 'react';
import { Order } from "@/types/order-types";

export const useOrdersFiltering = (orders: Order[] | undefined) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateSelect = useCallback((newDate: Date | undefined) => {
    setDate(newDate);
  }, []);

  // Memoize filtered orders to avoid recalculation on every render
  const filteredOrders = useMemo(() => {
    const ordersData = orders || [];
    if (!searchQuery && !date) return ordersData;
    
    const searchTermLower = searchQuery.toLowerCase();
    
    return ordersData.filter((order: Order) => {
      // Skip search filtering if no search term
      const orderMatchesSearch = !searchQuery || 
        (order.client?.toLowerCase().includes(searchTermLower) || false) ||
        (order.orderNumber?.toLowerCase().includes(searchTermLower) || false) ||
        (order.address?.toLowerCase().includes(searchTermLower) || false);

      // Skip date filtering if no date selected
      if (!date) return orderMatchesSearch;
      
      const orderDate = order.scheduledDate ? new Date(order.scheduledDate) : null;
      const selectedDate = date;

      const orderMatchesDate = !selectedDate || !orderDate ? true :
        orderDate.toDateString() === selectedDate.toDateString();

      return orderMatchesSearch && orderMatchesDate;
    });
  }, [orders, searchQuery, date]);

  return {
    date,
    searchQuery,
    filteredOrders,
    handleSearchChange,
    handleDateSelect
  };
};
