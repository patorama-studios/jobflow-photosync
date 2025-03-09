
import { Order, OrderStatus } from '../types/order-types';

// Helper function to convert string status to OrderStatus type
const validateStatus = (status: string | null | undefined): OrderStatus => {
  if (!status) return "pending";
  
  const validStatuses: OrderStatus[] = [
    "scheduled", "completed", "pending", "canceled", "cancelled",
    "rescheduled", "in_progress", "editing", "review", "delivered"
  ];
  
  return validStatuses.includes(status as OrderStatus) 
    ? (status as OrderStatus) 
    : "pending";
};

export function mapSupabaseOrdersToOrderType(supabaseOrders: any[]): Order[] {
  return supabaseOrders.map((order): Order => ({
    id: order.id,
    orderNumber: order.order_number || `Order-${order.id}`, // Ensure this is never undefined
    order_number: order.order_number,
    client: order.client || 'Unknown Client', // Ensure this is never undefined
    customerName: order.client, // Add for compatibility
    clientEmail: order.client_email,
    client_email: order.client_email,
    clientPhone: order.client_phone || '',
    client_phone: order.client_phone || '',
    photographer: order.photographer || '',
    photographerPayoutRate: order.photographer_payout_rate,
    photographer_payout_rate: order.photographer_payout_rate,
    price: order.price || 0, // Ensure this is never undefined
    propertyType: order.property_type || 'Residential', // Ensure this is never undefined
    property_type: order.property_type,
    scheduledDate: order.scheduled_date || new Date().toISOString(), // Ensure this is never undefined
    scheduled_date: order.scheduled_date,
    scheduledTime: order.scheduled_time || '12:00 PM', // Ensure this is never undefined
    scheduled_time: order.scheduled_time,
    squareFeet: order.square_feet || 0, // Ensure this is never undefined
    square_feet: order.square_feet,
    status: validateStatus(order.status),
    address: order.address || 'No address provided', // Ensure this is never undefined
    propertyAddress: order.address, // Add for compatibility
    city: order.city || '',
    state: order.state || '',
    zip: order.zip || '',
    package: order.package || '',
    customerNotes: order.customer_notes || '',
    customer_notes: order.customer_notes || '',
    internalNotes: order.internal_notes || '',
    internal_notes: order.internal_notes || '',
    stripePaymentId: order.stripe_payment_id || '',
    stripe_payment_id: order.stripe_payment_id || '',
    notes: order.notes || '',
    drivingTimeMin: order.driving_time_min || (15 + Math.floor(Math.random() * 30)) // Random driving time if not provided
  }));
}
