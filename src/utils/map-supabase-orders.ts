
import { Order } from '@/types/order-types';

export const mapSupabaseOrdersToOrderType = (ordersData: any[]): Order[] => {
  return ordersData.map(order => {
    return {
      id: order.id,
      orderNumber: order.order_number,
      client: order.client,
      clientEmail: order.client_email,
      clientPhone: order.client_phone,
      address: order.address,
      city: order.city,
      state: order.state,
      zip: order.zip,
      scheduledDate: order.scheduled_date,
      scheduledTime: order.scheduled_time,
      photographer: order.photographer,
      package: order.package,
      propertyType: order.property_type,
      squareFeet: order.square_feet,
      price: order.price,
      status: order.status,
      notes: order.notes,
      internalNotes: order.internal_notes,
      customerNotes: order.customer_notes,
      photographerPayoutRate: order.photographer_payout_rate,
      stripePaymentId: order.stripe_payment_id,
      
      // Also include the original field names for backward compatibility
      order_number: order.order_number,
      scheduled_date: order.scheduled_date,
      scheduled_time: order.scheduled_time,
      client_email: order.client_email,
      client_phone: order.client_phone,
      property_type: order.property_type,
      square_feet: order.square_feet,
      photographer_payout_rate: order.photographer_payout_rate,
      internal_notes: order.internal_notes,
      customer_notes: order.customer_notes,
      stripe_payment_id: order.stripe_payment_id
    };
  });
};
