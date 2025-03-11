
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { sampleOrders } from '@/data/sampleOrders';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';
import { validateStatus } from '@/utils/order-status-utils';

/**
 * Services for fetching orders from the database
 */

export const fetchOrders = async (): Promise<{ orders: Order[], error: string | null }> => {
  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], error: error.message };
    }

    // Use the mapper function to convert to Order type
    const orders = mapSupabaseOrdersToOrderType(ordersData || []);
    return { orders, error: null };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { orders: [], error: error.message || 'An unexpected error occurred' };
  }
};

export const fetchOrderDetails = async (orderId?: string | number): Promise<{ order: Order | null, error: string | null }> => {
  try {
    if (!orderId) {
      return { order: null, error: 'No order ID provided' };
    }
    
    const orderIdString = String(orderId); // Convert to string to ensure compatibility
    
    // Try with order_id column first
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderIdString)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching order details:', error);
      
      // Fallback to sample orders for development
      const sampleOrder = sampleOrders.find(o => o.id.toString() === orderIdString);
      if (sampleOrder) {
        // Ensure sample order has the correct status type
        const validOrder = {
          ...sampleOrder,
          status: validateStatus(sampleOrder.status)
        };
        return { order: validOrder, error: null };
      }
      
      return { order: null, error: error.message };
    }
    
    if (!data) {
      return { order: null, error: 'Order not found' };
    }
    
    // Use the mapper function to handle a single order
    const orders = mapSupabaseOrdersToOrderType([data]);
    const order = orders[0];
    
    return { order, error: null };
  } catch (err: any) {
    console.error('Error in fetchOrderDetails:', err);
    return { order: null, error: err.message || 'An unexpected error occurred' };
  }
};
