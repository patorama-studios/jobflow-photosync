
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';

/**
 * Services for modifying orders in the database
 */

export const saveOrderChanges = async (order: Order): Promise<{ success: boolean, error: string | null }> => {
  try {
    // Prepare the order data for Supabase
    const orderData = {
      ...order,
      order_id: String(order.id), // Include both id formats for backward compatibility
      id: String(order.id),
      scheduled_date: order.scheduledDate,
      scheduled_time: order.scheduledTime,
      appointment_start: new Date(order.scheduledDate).toISOString(),
      // Calculate appointment_end as 2 hours after appointment_start
      appointment_end: new Date(new Date(order.scheduledDate).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      total_order_price: order.price
    };
    
    // Try with new column name first
    const { error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('order_id', String(order.id));
    
    if (error) {
      console.error('Error saving order changes with order_id:', error);
      
      // Try with old column name if the new one doesn't work
      const fallbackResult = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', String(order.id));
      
      if (fallbackResult.error) {
        console.error('Error saving order changes with id:', fallbackResult.error);
        return { success: false, error: fallbackResult.error.message };
      }
    }
    
    console.log('Order updated successfully');
    return { success: true, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Error in saveOrderChanges:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<{ success: boolean; data: Order | null; error: string | null }> => {
  try {
    // Generate appointment start and end times
    const appointmentStart = new Date(order.scheduledDate || new Date()).toISOString();
    const appointmentEnd = new Date(new Date(order.scheduledDate || new Date()).getTime() + 2 * 60 * 60 * 1000).toISOString();
    
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
      total_order_price: order.price || order.amount || 0,
      property_type: order.propertyType || order.property_type || '',
      scheduled_date: order.scheduledDate || order.scheduled_date || '',
      scheduled_time: order.scheduledTime || order.scheduled_time || '',
      appointment_start: appointmentStart,
      appointment_end: appointmentEnd,
      square_feet: order.squareFeet || order.square_feet || 0,
      state: order.state || '',
      status: order.status || 'pending',
      stripe_payment_id: order.stripePaymentId || order.stripe_payment_id || '',
      zip: order.zip || '',
      hours_on_site: 2, // Default to 2 hours on site
      timezone: 'UTC', // Default timezone
      total_payout_amount: (order.photographerPayoutRate || order.photographer_payout_rate || 0)
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

    // Convert response to Order type using our mapper
    const orders = mapSupabaseOrdersToOrderType([data]);
    const createdOrder = orders[0];

    toast.success("Order created successfully");
    return { success: true, data: createdOrder, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error("Error creating order:", errorMessage);
    toast.error("An unexpected error occurred while creating the order");
    return { success: false, data: null, error: errorMessage };
  }
};
