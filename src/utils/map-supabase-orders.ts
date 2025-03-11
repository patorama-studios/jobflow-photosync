
import { Order, OrderStatus } from '../types/order-types';

// Helper function to convert string status to OrderStatus type
export const validateStatus = (status: string | null | undefined): OrderStatus => {
  if (!status) return "pending";
  
  const validStatuses: OrderStatus[] = [
    "scheduled", "completed", "pending", "canceled", "cancelled",
    "rescheduled", "in_progress", "editing", "review", "delivered", "unavailable"
  ];
  
  return validStatuses.includes(status as OrderStatus) 
    ? (status as OrderStatus) 
    : "pending";
};

export function mapSupabaseOrdersToOrderType(supabaseOrders: any[]): Order[] {
  return supabaseOrders.map((order): Order => ({
    id: order.order_id || order.id,
    orderNumber: order.order_number || `Order-${order.order_id || order.id}`, 
    order_number: order.order_number,
    client: order.client || 'Unknown Client',
    customerName: order.client,
    clientEmail: order.client_email,
    client_email: order.client_email,
    clientPhone: order.client_phone || '',
    client_phone: order.client_phone || '',
    photographer: order.photographer || '',
    photographerPayoutRate: order.photographer_payout_rate,
    photographer_payout_rate: order.photographer_payout_rate,
    price: order.price || order.total_order_price || 0,
    propertyType: order.property_type || 'Residential',
    property_type: order.property_type,
    scheduledDate: order.scheduled_date || order.appointment_start || new Date().toISOString(),
    scheduled_date: order.scheduled_date || order.appointment_start,
    scheduledTime: order.scheduled_time || '12:00 PM',
    scheduled_time: order.scheduled_time,
    squareFeet: order.square_feet || 0,
    square_feet: order.square_feet,
    status: validateStatus(order.status),
    address: order.address || 'No address provided',
    propertyAddress: order.address,
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
    drivingTimeMin: order.driving_time_min || (15 + Math.floor(Math.random() * 30)),
    // New fields from the updated schema
    appointment_start: order.appointment_start,
    appointment_end: order.appointment_end,
    hours_on_site: order.hours_on_site || 2,
    timezone: order.timezone || 'UTC',
    total_payout_amount: order.total_payout_amount || 0,
    total_order_price: order.total_order_price || order.price || 0,
    total_amount_paid: order.total_amount_paid || 0,
    company_id: order.company_id,
    invoice_number: order.invoice_number
  }));
}
