
import { Order } from '../types/order-types';

export function mapSupabaseOrdersToOrderType(supabaseOrders: any[]): Order[] {
  return supabaseOrders.map((order): Order => ({
    id: order.id,
    orderNumber: order.order_number,
    order_number: order.order_number,
    client: order.client,
    customerName: order.client, // Add for compatibility
    clientEmail: order.client_email,
    client_email: order.client_email,
    clientPhone: order.client_phone || '',
    client_phone: order.client_phone || '',
    photographer: order.photographer || '',
    photographerPayoutRate: order.photographer_payout_rate,
    photographer_payout_rate: order.photographer_payout_rate,
    price: order.price,
    propertyType: order.property_type,
    property_type: order.property_type,
    scheduledDate: order.scheduled_date,
    scheduled_date: order.scheduled_date,
    scheduledTime: order.scheduled_time,
    scheduled_time: order.scheduled_time,
    squareFeet: order.square_feet,
    square_feet: order.square_feet,
    status: order.status,
    address: order.address,
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
    drivingTimeMin: 15 + Math.floor(Math.random() * 30) // Random driving time
  }));
}
