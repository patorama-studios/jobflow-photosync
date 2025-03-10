
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { toast } from 'sonner';
import { deleteAllOrders } from '@/services/orders/order-delete-service';

export function useOrders() {
  const queryClient = useQueryClient();
  
  const {
    data: orders,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      console.log('Fetching orders...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('scheduled_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(error.message);
      }
      
      console.log('Orders fetched:', data?.length || 0);
      return mapSupabaseOrdersToOrderType(data || []);
    }
  });

  // Add a function to handle clearing all orders
  const clearAllOrders = async () => {
    try {
      const result = await deleteAllOrders();
      if (result.success) {
        toast.success('All orders have been cleared');
        refetch();
      } else {
        toast.error(`Failed to clear orders: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error clearing orders: ${error.message}`);
    }
  };

  return {
    orders,
    isLoading,
    error,
    refetch,
    clearAllOrders
  };
}
