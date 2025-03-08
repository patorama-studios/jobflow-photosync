import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { sampleOrders } from '@/data/sampleOrders'; 
import { toast } from 'sonner';

export const fetchOrders = async (): Promise<{ orders: Order[], error: string | null }> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], error: error.message };
    }

    return { orders: orders as Order[], error: null };
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
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderIdString)
      .single();
    
    if (error) {
      console.error('Error fetching order details:', error);
      
      // Fallback to sample orders for development
      const sampleOrder = sampleOrders.find(o => o.id.toString() === orderIdString);
      if (sampleOrder) {
        return { order: sampleOrder, error: null };
      }
      
      return { order: null, error: error.message };
    }
    
    // Transform the data into the Order type if needed
    return { order: data as Order, error: null };
  } catch (err: any) {
    console.error('Error in fetchOrderDetails:', err);
    return { order: null, error: err.message || 'An unexpected error occurred' };
  }
};

export const saveOrderChanges = async (order: Order): Promise<{ success: boolean, error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', String(order.id))
      .select()
      .single();
    
    if (error) {
      console.error('Error saving order changes:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Order updated successfully:', data);
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in saveOrderChanges:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const deleteOrder = async (orderId?: string | number): Promise<{ success: boolean, error: string | null }> => {
  try {
    if (!orderId) {
      return { success: false, error: 'No order ID provided' };
    }
    
    const orderIdString = String(orderId); // Convert to string to ensure compatibility
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderIdString);
    
    if (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Order deleted successfully');
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error in deleteOrder:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<{ success: boolean; data: Order | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      toast.error(`Failed to create order: ${error.message}`);
      return { success: false, data: null, error: error.message };
    }

    toast.success("Order created successfully");
    return { success: true, data: data as Order, error: null };
  } catch (err: any) {
    console.error("Error creating order:", err);
    toast.error("An unexpected error occurred while creating the order");
    return { success: false, data: null, error: err.message || "An unexpected error occurred" };
  }
};
