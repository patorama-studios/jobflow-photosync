
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteOrder = async (orderId: string): Promise<{ success: boolean, error: string | null }> => {
  try {
    // Try with new column name first
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_id', orderId);
    
    if (error) {
      console.error('Error deleting order with order_id:', error);
      
      // Try with old column name if the new one doesn't work
      const fallbackResult = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (fallbackResult.error) {
        console.error('Error deleting order with id:', fallbackResult.error);
        return { success: false, error: fallbackResult.error.message };
      }
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteOrder:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const deleteAllOrders = async (): Promise<{ success: boolean, error: string | null }> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .gte('order_id', '0'); // Delete all records with new column name
    
    if (error) {
      console.error('Error deleting all orders with order_id:', error);
      
      // Try with old column name if the new one doesn't work
      const fallbackResult = await supabase
        .from('orders')
        .delete()
        .gte('id', '0');
      
      if (fallbackResult.error) {
        console.error('Error deleting all orders with id:', fallbackResult.error);
        return { success: false, error: fallbackResult.error.message };
      }
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteAllOrders:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
