
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';

/**
 * Services for modifying orders in the database
 */

export const saveOrderChanges = async (order: Order): Promise<{ success: boolean, error: string | null, orderId?: string }> => {
  try {
    // Check if this is a new order (id is 'new') or updating existing order
    const isNewOrder = order.id === 'new';
    
    if (isNewOrder) {
      // Creating a new order
      return await createNewOrder(order);
    } else {
      // Updating existing order
      return await updateExistingOrder(order);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Error in saveOrderChanges:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

const updateExistingOrder = async (order: Order): Promise<{ success: boolean, error: string | null, orderId?: string }> => {
  // Prepare the order data for Supabase
  const orderData = {
    id: String(order.id),
    order_id: String(order.id), // Include both id formats for backward compatibility
    scheduled_date: order.scheduledDate,
    scheduled_time: order.scheduledTime,
    appointment_start: new Date(order.scheduledDate).toISOString(),
    // Calculate appointment_end as 2 hours after appointment_start
    appointment_end: new Date(new Date(order.scheduledDate).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    total_order_price: order.price,
    address: order.address,
    city: order.city,
    state: order.state,
    zip: order.zip,
    client: order.client || order.customerName,
    client_email: order.clientEmail || order.client_email,
    client_phone: order.clientPhone || order.client_phone,
    photographer: order.photographer,
    photographer_payout_rate: order.photographerPayoutRate || order.photographer_payout_rate,
    price: order.price,
    property_type: order.propertyType || order.property_type,
    square_feet: order.squareFeet || order.square_feet,
    status: order.status,
    internal_notes: order.internalNotes || order.internal_notes,
    customer_notes: order.customerNotes || order.customer_notes,
    package: order.package,
    stripe_payment_id: order.stripePaymentId || order.stripe_payment_id
  };
  
  // Try with id column
  const { error } = await supabase
    .from('orders')
    .update(orderData)
    .eq('id', String(order.id));
  
  if (error) {
    console.error('Error saving order changes:', error);
    return { success: false, error: error.message };
  }
  
  console.log('Order updated successfully');
  return { success: true, error: null, orderId: String(order.id) };
};

const createNewOrder = async (order: Order): Promise<{ success: boolean, error: string | null, orderId?: string }> => {
  // Generate appointment start and end times
  const appointmentStart = new Date(order.scheduledDate || new Date()).toISOString();
  const appointmentEnd = new Date(new Date(order.scheduledDate || new Date()).getTime() + 2 * 60 * 60 * 1000).toISOString();
  
  // Prepare order data without the 'id' field since Supabase will generate one
  const orderData = {
    address: order.address || '',
    city: order.city || '',
    state: order.state || '',
    zip: order.zip || '',
    client: order.client || order.customerName || '',
    client_email: order.clientEmail || order.client_email || '',
    client_phone: order.clientPhone || order.client_phone || '',
    customer_notes: order.customerNotes || order.customer_notes || '',
    internal_notes: order.internalNotes || order.internal_notes || '',
    notes: order.notes || '',
    order_number: order.orderNumber || `ORD-${Date.now()}`,
    package: order.package || '',
    photographer: order.photographer || '',
    photographer_payout_rate: order.photographerPayoutRate || order.photographer_payout_rate || 0,
    price: order.price || 0,
    total_order_price: order.price || 0,
    property_type: order.propertyType || order.property_type || '',
    scheduled_date: order.scheduledDate || '',
    scheduled_time: order.scheduledTime || '',
    appointment_start: appointmentStart,
    appointment_end: appointmentEnd,
    square_feet: order.squareFeet || order.square_feet || 0,
    status: order.status || 'pending',
    stripe_payment_id: order.stripePaymentId || order.stripe_payment_id || '',
  };
  
  console.log("Creating new order with data:", orderData);
  
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select();

  if (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }

  console.log("Order created successfully, response:", data);
  
  if (!data || data.length === 0) {
    return { success: true, error: "No data returned from insert operation", orderId: undefined };
  }

  // Return the ID of the newly created order
  return { success: true, error: null, orderId: data[0].id };
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
      zip: order.zip || ''
    };
    
    console.log("Creating order with data:", orderData);
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error("Error creating order:", error);
      toast.error(`Failed to create order: ${error.message}`);
      return { success: false, data: null, error: error.message };
    }

    console.log("Order created successfully, raw response:", data);
    
    if (!data || data.length === 0) {
      return { success: true, data: null, error: "No data returned from insert operation" };
    }

    // Convert response to Order type using our mapper
    const orders = mapSupabaseOrdersToOrderType(data);
    const createdOrder = orders[0];

    console.log("Mapped order:", createdOrder);
    toast.success("Order created successfully");
    return { success: true, data: createdOrder, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error("Error creating order:", errorMessage);
    toast.error("An unexpected error occurred while creating the order");
    return { success: false, data: null, error: errorMessage };
  }
};
