import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';
import { deleteAllOrders } from '@/services/order-service';

// Function to add a dummy order for testing
export async function addDummyOrder() {
  try {
    const dummyOrder = {
      order_number: `ORD-${Date.now().toString().slice(-6)}`,
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
      client: 'Test Client',
      client_email: 'test@example.com',
      client_phone: '555-123-4567',
      photographer: 'Maria Garcia',
      photographer_payout_rate: 120,
      price: 199.99,
      property_type: 'Residential',
      scheduled_date: new Date().toISOString(),
      scheduled_time: '10:00 AM',
      square_feet: 2000,
      status: 'scheduled',
      package: 'Standard Package',
      notes: 'This is a test order',
      customer_notes: 'Client requested afternoon if possible',
      internal_notes: 'Added for testing purposes'
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(dummyOrder)
      .select();

    if (error) {
      console.error('Error adding dummy order:', error);
      toast.error('Failed to add dummy order');
      return null;
    }

    toast.success('Dummy order added successfully');
    return data[0];
  } catch (err) {
    console.error('Error in addDummyOrder:', err);
    toast.error('Error adding dummy order');
    return null;
  }
}

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

  const addDummyOrderMutation = useMutation({
    mutationFn: addDummyOrder,
    onSuccess: () => {
      // Invalidate orders query to refresh the list
      console.log('Invalidating orders query after adding dummy order');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const clearAllOrdersMutation = useMutation({
    mutationFn: deleteAllOrders,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate orders query to refresh the list
        console.log('Invalidating orders query after clearing all orders');
        toast.success(`Successfully deleted ${result.count || 'all'} orders`);
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else {
        toast.error(`Failed to clear orders: ${result.error}`);
      }
    },
    onError: (error: any) => {
      console.error('Error clearing orders:', error);
      toast.error(`Error clearing orders: ${error.message || 'Unknown error'}`);
    }
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    addDummyOrder: () => addDummyOrderMutation.mutate(),
    clearAllOrders: () => clearAllOrdersMutation.mutate()
  };
}
