
import { Order } from '@/types/order-types';

/**
 * Maps raw Supabase order data to our Order type
 */
export const mapSupabaseDataToOrder = (data: any): Order | null => {
  if (!data) return null;
  
  return {
    id: data.id,
    orderNumber: data.order_number,
    client: data.client,
    clientEmail: data.client_email,
    clientPhone: data.client_phone,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    scheduledDate: data.scheduled_date,
    scheduledTime: data.scheduled_time,
    photographer: data.photographer,
    propertyType: data.property_type,
    squareFeet: data.square_feet,
    price: data.price,
    status: data.status,
    notes: data.notes,
    internalNotes: data.internal_notes,
    customerNotes: data.customer_notes,
    photographerPayoutRate: data.photographer_payout_rate,
    stripePaymentId: data.stripe_payment_id,
    
    // Legacy property names for compatibility
    order_number: data.order_number,
    client_email: data.client_email,
    client_phone: data.client_phone,
    scheduled_date: data.scheduled_date,
    scheduled_time: data.scheduled_time,
    property_type: data.property_type,
    square_feet: data.square_feet,
    photographer_payout_rate: data.photographer_payout_rate,
    internal_notes: data.internal_notes,
    customer_notes: data.customer_notes,
    stripe_payment_id: data.stripe_payment_id
  };
};

/**
 * Creates a mock order for development and testing
 */
export const createMockOrder = (orderId: string | number): Order => {
  return {
    id: typeof orderId === 'string' ? orderId : String(orderId),
    orderNumber: typeof orderId === 'string' ? orderId : `ORD-${orderId}`,
    client: 'Mock Client',
    clientEmail: 'mock@example.com',
    clientPhone: '123-456-7890',
    address: '123 Mock Street',
    city: 'Mockville',
    state: 'CA',
    zip: '12345',
    scheduledDate: '2023-06-15',
    scheduledTime: '10:00 AM',
    photographer: 'Mock Photographer',
    propertyType: 'Residential',
    squareFeet: 2000,
    price: 250,
    status: 'scheduled',
    internalNotes: 'This is a mock order for development',
    order_number: typeof orderId === 'string' ? orderId : `ORD-${orderId}`,
    scheduled_date: '2023-06-15',
    scheduled_time: '10:00 AM',
    property_type: 'Residential',
    square_feet: 2000,
    photographer_payout_rate: 125
  };
};
