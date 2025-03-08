
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';
import { mapSupabaseDataToOrder, createMockOrder } from '@/utils/order-mapper';

/**
 * Fetches order details by ID or order number
 */
export async function fetchOrderDetails(orderId: string | number | undefined): Promise<{
  order: Order | null;
  error: string | null;
}> {
  try {
    // Check if orderId exists and is not empty
    if (!orderId) {
      console.log("No order ID provided, returning mock data");
      // Return mock data when no ID is provided
      return { 
        order: createMockOrder("ORD-DEFAULT"), 
        error: null 
      };
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
    const { error } = await supabase
      .from('orders')
      .update({
        client: order.client || order.customerName,
        client_email: order.clientEmail || order.contactEmail,
        client_phone: order.clientPhone || order.contactNumber,
        address: order.address || order.propertyAddress,
        city: order.city,
        state: order.state,
        zip: order.zip,
        property_type: order.propertyType || order.property_type,
        square_feet: order.squareFeet || order.square_feet,
        scheduled_date: order.scheduledDate || order.scheduled_date,
        scheduled_time: order.scheduledTime || order.scheduled_time,
        photographer: order.photographer,
        photographer_payout_rate: order.photographerPayoutRate || order.photographer_payout_rate,
        price: order.price || order.amount,
        status: order.status,
        package: order.package,
        notes: order.notes,
        internal_notes: order.internalNotes || order.internal_notes,
        customer_notes: order.customerNotes || order.customer_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (error) throw error;
    
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
    // Actually delete the order from the database
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return { 
      success: false, 
      error: err.message || 'An unexpected error occurred while deleting'
    };
  }
}
