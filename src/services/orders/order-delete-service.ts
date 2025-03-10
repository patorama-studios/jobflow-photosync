
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
    
    // Perform the delete operation directly
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

export const deleteAllOrders = async (): Promise<{ success: boolean, error: string | null }> => {
  try {
    console.log('Deleting all orders');
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all orders
    
    if (error) {
      console.error('Error deleting all orders:', error);
      return { success: false, error: error.message };
    }
    
    console.log('All orders deleted successfully');
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteAllOrders:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
