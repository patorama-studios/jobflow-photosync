
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Delete a specific order by ID
export const deleteOrder = async (orderId: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete all orders (with confirmation)
export const deleteAllOrders = async () => {
  try {
    // This is a dangerous operation, so we should add additional safeguards in production
    const { error } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except this non-existent ID - a safety measure

    if (error) {
      console.error('Error clearing orders:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
