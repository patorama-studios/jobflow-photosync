
import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { deleteOrder as deleteOrderService } from '@/services/order-service';
import { toast } from 'sonner';

export function useOrderDetails(orderId: string) {
  const queryClient = useQueryClient();
  
  // Fetch order details
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order details:', error);
        throw new Error(error.message);
      }
      
      const orders = mapSupabaseOrdersToOrderType([data]);
      return orders[0];
    },
    enabled: !!orderId
  });
  
  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await deleteOrderService(orderId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete order');
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete order: ${error.message}`);
    }
  });
  
  return {
    order,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    deleteOrder: deleteMutation.mutate,
  };
}
