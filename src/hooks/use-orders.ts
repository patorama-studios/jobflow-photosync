
import { useState, useEffect } from 'react';
import { Order, OrderFilters, Pagination } from '@/types/orders';
import { supabase } from '@/integrations/supabase/client';

export const useOrders = (
  filters: OrderFilters = {},
  pagination: { page: number; limit: number } = { page: 1, limit: 10 }
) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Pagination>({
    currentPage: pagination.page,
    itemsPerPage: pagination.limit,
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('orders').select('*', { count: 'exact' });

        // Apply filters
        if (filters.status) {
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }

        if (filters.photographer) {
          query = query.eq('photographer', filters.photographer);
        }

        if (filters.dateRange) {
          const { startDate, endDate } = filters.dateRange as { startDate: Date; endDate: Date };
          query = query.gte('scheduled_date', startDate.toISOString().split('T')[0]);
          query = query.lte('scheduled_date', endDate.toISOString().split('T')[0]);
        }

        if (filters.searchQuery) {
          query = query.or(
            `client.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%,order_number.ilike.%${filters.searchQuery}%`
          );
        }

        // Apply sorting
        if (filters.sortBy) {
          const order = filters.sortDirection || 'asc';
          query = query.order(filters.sortBy, { ascending: order === 'asc' });
        } else {
          query = query.order('scheduled_date', { ascending: true });
        }

        // Apply pagination
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        if (data) {
          // Convert to Order objects with both new and legacy properties
          const mappedOrders: Order[] = data.map(item => ({
            id: item.id,
            orderNumber: item.order_number,
            client: item.client,
            clientEmail: item.client_email,
            clientPhone: item.client_phone,
            address: item.address,
            city: item.city,
            state: item.state,
            zip: item.zip,
            scheduledDate: item.scheduled_date,
            scheduledTime: item.scheduled_time,
            photographer: item.photographer,
            propertyType: item.property_type,
            squareFeet: item.square_feet,
            price: item.price,
            status: item.status as any,
            photographerPayoutRate: item.photographer_payout_rate,
            package: item.package,
            
            // Also set legacy properties for backward compatibility
            order_number: item.order_number,
            scheduled_date: item.scheduled_date,
            scheduled_time: item.scheduled_time,
            client_email: item.client_email,
            client_phone: item.client_phone,
            property_type: item.property_type,
            square_feet: item.square_feet,
            photographer_payout_rate: item.photographer_payout_rate,
            customer_notes: item.customer_notes,
            internal_notes: item.internal_notes,
            stripe_payment_id: item.stripe_payment_id
          }));
          
          setOrders(mappedOrders);

          if (count !== null) {
            setPaginationInfo({
              currentPage: pagination.page,
              itemsPerPage: pagination.limit,
              totalItems: count,
              totalPages: Math.ceil(count / pagination.limit),
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [filters, pagination.page, pagination.limit]);

  return { orders, isLoading, error, pagination: paginationInfo };
};
