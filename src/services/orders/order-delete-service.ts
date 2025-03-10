
import { supabase } from '@/integrations/supabase/client';

/**
 * Services for deleting orders from the database
 */

export const deleteOrder = async (orderId?: string | number): Promise<{ success: boolean, error: string | null }> => {
  try {
    if (!orderId) {
      return { success: false, error: 'No order ID provided' };
    }
    
    console.log('Deleting order with ID:', orderId);
    const orderIdString = String(orderId); // Convert to string to ensure compatibility
    
    // First, check if the order exists
    const { data: orderExists, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderIdString)
      .single();
    
    if (checkError) {
      console.error('Order not found or error checking:', checkError);
      return { success: false, error: checkError?.message || 'Order not found' };
    }
    
    // Perform the delete operation
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderIdString);
    
    if (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Order deleted successfully', orderIdString);
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteOrder:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const deleteAllOrders = async (): Promise<{ success: boolean, error: string | null, count?: number }> => {
  try {
    console.log('Deleting all orders');
    
    // First, count how many orders we're about to delete
    const { count: orderCount, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting orders:', countError);
      return { success: false, error: countError.message };
    }
    
    // Now delete all orders
    const { error } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all orders
    
    if (error) {
      console.error('Error deleting all orders:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`${orderCount} orders deleted successfully`);
    return { success: true, error: null, count: orderCount };
  } catch (err: any) {
    console.error('Error in deleteAllOrders:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
