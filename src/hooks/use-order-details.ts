
import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';
import { orderService } from '@/services/mysql/order-service';

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
      
      console.log('🔧 useOrderDetails: Fetching order from MySQL:', orderId);
      const orderData = await orderService.getOrderById(orderId);
      
      if (!orderData) {
        throw new Error('Order not found');
      }
      
      console.log('🔧 useOrderDetails: Order fetched successfully');
      return orderData;
    },
    enabled: !!orderId
  });
  
  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log('🔧 useOrderDetails: Deleting order:', orderId);
      const success = await orderService.deleteOrder(orderId);
      if (!success) {
        throw new Error('Failed to delete order');
      }
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
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
