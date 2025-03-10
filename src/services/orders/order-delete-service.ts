
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const deleteOrder = async (orderId: string): Promise<{ success: boolean, error: string | null }> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
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
      .gte('id', '0'); // Delete all records
    
    if (error) {
      console.error('Error deleting all orders:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteAllOrders:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};
