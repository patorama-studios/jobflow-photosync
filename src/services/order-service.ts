
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { sampleOrders } from '@/data/sampleOrders'; 
import { toast } from 'sonner';

export const fetchOrders = async (): Promise<{ orders: Order[], error: string | null }> => {
  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*');

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], error: error.message };
    }

    // Convert to Order type with required fields
    const orders: Order[] = ordersData.map(item => ({
      ...item,
      id: item.id,
      scheduledDate: item.scheduled_date || '',
      scheduledTime: item.scheduled_time || '',
    })) as Order[];

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
    
    // Transform the data to include required fields for Order type
    const order: Order = {
      ...data,
      id: data.id,
      scheduledDate: data.scheduled_date || '',
      scheduledTime: data.scheduled_time || '',
    } as Order;
    
    return { order, error: null };
  } catch (err: any) {
    console.error('Error in fetchOrderDetails:', err);
    return { order: null, error: err.message || 'An unexpected error occurred' };
  }
};

export const saveOrderChanges = async (order: Order): Promise<{ success: boolean, error: string | null }> => {
  try {
    // Prepare the order data for Supabase
    const orderData = {
      ...order,
      id: String(order.id), // Convert id to string for Supabase
      scheduled_date: order.scheduledDate,
      scheduled_time: order.scheduledTime
    };
    
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
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
    // Convert order data to the format expected by Supabase
    const orderData = {
      address: order.address || order.propertyAddress || '',
      city: order.city || '',
      client: order.customerName || order.client || '',
      client_email: order.clientEmail || order.client_email || '',
      client_phone: order.clientPhone || order.client_phone || '',
      customer_notes: order.customerNotes || order.customer_notes || '',
      internal_notes: order.internalNotes || order.internal_notes || '',
      notes: order.notes || '',
      order_number: order.orderNumber || order.order_number || `ORD-${Date.now()}`,
      package: order.package || '',
      photographer: order.photographer || '',
      photographer_payout_rate: order.photographerPayoutRate || order.photographer_payout_rate || 0,
      price: order.price || order.amount || 0,
      property_type: order.propertyType || order.property_type || '',
      scheduled_date: order.scheduledDate || order.scheduled_date || '',
      scheduled_time: order.scheduledTime || order.scheduled_time || '',
      square_feet: order.squareFeet || order.square_feet || 0,
      state: order.state || '',
      status: order.status || 'pending',
      stripe_payment_id: order.stripePaymentId || order.stripe_payment_id || '',
      zip: order.zip || ''
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      toast.error(`Failed to create order: ${error.message}`);
      return { success: false, data: null, error: error.message };
    }

    // Convert response to Order type
    const createdOrder: Order = {
      ...data,
      id: data.id,
      scheduledDate: data.scheduled_date || '',
      scheduledTime: data.scheduled_time || '',
    } as Order;

    toast.success("Order created successfully");
    return { success: true, data: createdOrder, error: null };
  } catch (err: any) {
    console.error("Error creating order:", err);
    toast.error("An unexpected error occurred while creating the order");
    return { success: false, data: null, error: err.message || "An unexpected error occurred" };
  }
};
