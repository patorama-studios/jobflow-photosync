
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';
import { orderService } from '@/services/mysql/order-service';

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
      console.log('🔧 useOrders: Fetching orders from MySQL...');
      const ordersData = await orderService.getAllOrders();
      console.log('🔧 useOrders: Orders fetched:', ordersData?.length || 0);
      return ordersData;
    }
  });

  // Add a function to handle clearing all orders
  const clearAllOrders = async () => {
    try {
      const success = await orderService.deleteAllOrders();
      if (success) {
        toast.success('All orders have been cleared');
        refetch();
      } else {
        toast.error('Failed to clear orders');
      }
    } catch (error: any) {
      toast.error(`Error clearing orders: ${error.message}`);
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: Omit<Order, 'id' | 'orderNumber'>) => {
      return await orderService.createOrder(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create order: ${error.message}`);
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      return await orderService.updateOrder(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update order: ${error.message}`);
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      return await orderService.deleteOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete order: ${error.message}`);
    }
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    clearAllOrders,
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending
  };
}
