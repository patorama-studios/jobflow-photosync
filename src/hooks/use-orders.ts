import { useState, useEffect, useCallback } from 'react';
import { sampleOrders } from '@/data/sample-orders';
import { Order, OrderStatus, OrderFilters } from '@/types/orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [statistics, setStatistics] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    pending: 0,
    canceled: 0,
    revenue: 0,
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the API
        // For now, using sample data
        
        const mappedOrders: Order[] = sampleOrders.map(order => ({
          id: order.id.toString(),
          order_number: order.orderNumber,
          client: order.client,
          client_email: order.clientEmail,
          client_phone: order.clientPhone,
          address: order.address,
          city: order.city,
          state: order.state,
          zip: order.zip,
          scheduled_date: order.scheduledDate,
          scheduled_time: order.scheduledTime,
          photographer: order.photographer,
          photographer_payout_rate: order.photographerPayoutRate,
          price: order.price,
          property_type: order.propertyType,
          square_feet: order.squareFeet,
          status: order.status as OrderStatus,
          notes: order.notes,
          internal_notes: order.internalNotes,
          customer_notes: order.customerNotes,
          package: order.package,
          stripe_payment_id: order.stripePaymentId
        }));
        
        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders);
        
        // Calculate statistics
        const total = mappedOrders.length;
        const scheduled = mappedOrders.filter(order => order.status === 'scheduled').length;
        const completed = mappedOrders.filter(order => order.status === 'completed').length;
        const pending = mappedOrders.filter(order => order.status === 'pending').length;
        const canceled = mappedOrders.filter(order => order.status === 'canceled').length;
        const revenue = mappedOrders.reduce((sum, order) => {
          return order.status === 'completed' ? sum + order.price : sum;
        }, 0);

        setStatistics({
          total,
          scheduled,
          completed,
          pending,
          canceled,
          revenue,
        });
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to update filters
  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  // Apply filters to orders
  const applyFilters = useCallback(() => {
    if (!orders.length) return;

    let result = [...orders];

    // Filter by status
    if (filters.status && filters.status.length) {
      const statusFilters = Array.isArray(filters.status) 
        ? filters.status 
        : [filters.status as OrderStatus];
        
      result = result.filter(order => 
        statusFilters.includes(order.status as OrderStatus)
      );
    }

    // Filter by dateRange
    if (filters.dateRange) {
      const { from, to } = filters.dateRange as { from?: Date; to?: Date };
      
      if (from) {
        result = result.filter(order => 
          new Date(order.scheduled_date) >= from
        );
      }
      
      if (to) {
        result = result.filter(order => 
          new Date(order.scheduled_date) <= to
        );
      }
    }

    // Filter by photographer
    if (filters.photographer) {
      result = result.filter(order =>
        order.photographer.toLowerCase().includes(filters.photographer!.toLowerCase())
      );
    }

    // Filter by searchQuery
    if (filters.searchQuery) {
      const lowerCaseQuery = filters.searchQuery.toLowerCase();
      result = result.filter(order =>
        order.order_number.toLowerCase().includes(lowerCaseQuery) ||
        order.client.toLowerCase().includes(lowerCaseQuery) ||
        order.address.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredOrders(result);
  }, [orders, filters]);

  // Apply sorting to orders
  const applySorting = useCallback((sortBy?: string, sortDirection: "asc" | "desc" = "asc") => {
    if (!sortBy) return;

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const aValue = a[sortBy as keyof Order];
      const bValue = b[sortBy as keyof Order];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredOrders(sortedOrders);
  }, [filteredOrders]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    filters,
    statistics,
    updateFilters,
    applySorting
  };
}
