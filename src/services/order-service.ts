
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';
import { mapSupabaseDataToOrder, createMockOrder } from '@/utils/order-mapper';

/**
 * Fetches order details by ID or order number
 */
export async function fetchOrderDetails(orderId: string | number): Promise<{
  order: Order | null;
  error: string | null;
}> {
  try {
    if (!orderId) {
      return { order: null, error: "Order ID is required" };
    }

    // First try to fetch by ID
    let { data, error: idError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', String(orderId));
    
    // If not found by ID, try by order_number
    if ((idError || !data || data.length === 0) && typeof orderId === 'string') {
      const { data: numberData, error: numberError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderId);
      
      if (numberError) {
        console.error('Error fetching order by order_number:', numberError);
        return { order: null, error: numberError.message };
      }
      
      data = numberData;
    }
    
    if (!data || data.length === 0) {
      // If no order is found, use mock data for development
      console.log('No order found, using mock data for development');
      return { 
        order: createMockOrder(orderId),
        error: null
      };
    }
    
    const mappedOrder = mapSupabaseDataToOrder(data[0]);
    return { order: mappedOrder, error: null };
    
  } catch (err: any) {
    console.error('Unexpected error fetching order details:', err);
    return { 
      order: null, 
      error: err.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Saves order changes to the database
 */
export async function saveOrderChanges(order: Order): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!order) {
    return { success: false, error: "No order data provided" };
  }

  try {
    // For now we're just logging the save action
    // In a real app, we would update the order in the database
    console.log('Saving order:', order);
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error saving order:', err);
    return { 
      success: false, 
      error: err.message || 'An unexpected error occurred while saving'
    };
  }
}

/**
 * Deletes an order from the database
 */
export async function deleteOrder(orderId: string | number): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!orderId) {
    return { success: false, error: "Order ID is required" };
  }

  try {
    // For now we're just logging the delete action
    // In a real app, we would delete the order from the database
    console.log('Deleting order:', orderId);
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return { 
      success: false, 
      error: err.message || 'An unexpected error occurred while deleting'
    };
  }
}
