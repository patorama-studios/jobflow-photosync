
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { Order } from '@/types/order-types';

export function useOrders() {
  const {
    data: orders,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('scheduled_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(error.message);
      }
      
      return mapSupabaseOrdersToOrderType(data || []);
    }
  });

  return {
    orders,
    isLoading,
    error,
    refetch
  };
}
