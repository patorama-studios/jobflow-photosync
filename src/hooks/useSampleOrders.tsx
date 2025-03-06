
import { useState, useEffect } from 'react';
import { Order as SampleOrder } from '@/data/sampleOrders';
import { generateSampleOrders } from '@/data/sampleOrders';

// Define our Order type to match what's used in the component
export type Order = {
  id: number;
  orderNumber: string;
  address: string;
  client: string;
  photographer: string;
  photographerPayoutRate: number;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: 'pending' | 'scheduled' | 'completed';
  client_email?: string;
  client_phone?: string;
  order_number?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  property_type?: string;
  square_feet?: number;
  stripe_payment_id?: string;
  additionalAppointments?: Array<{
    date: string;
    time: string;
    description: string;
  }>;
  customFields?: Record<string, any>;
  customerNotes?: string;
  internalNotes?: string;
  mediaUploaded?: boolean;
  mediaLinks?: string[];
  // Fields for Calendar integration
  drivingTimeMin?: number;
  previousLocation?: string;
};

export const useSampleOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Load sample data and convert to our Order type
    const sampleOrdersData = generateSampleOrders();
    const mappedOrders: Order[] = sampleOrdersData.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || order.order_number || '',
      address: order.address,
      client: order.client,
      photographer: order.photographer,
      photographerPayoutRate: order.photographerPayoutRate || (order.photographer_payout_rate as number) || 0,
      price: order.price,
      propertyType: order.propertyType || order.property_type || '',
      scheduledDate: order.scheduledDate || order.scheduled_date || '',
      scheduledTime: order.scheduledTime || order.scheduled_time || '',
      squareFeet: order.squareFeet || order.square_feet || 0,
      status: order.status as 'pending' | 'scheduled' | 'completed',
      client_email: order.clientEmail || order.client_email,
      client_phone: order.clientPhone || order.client_phone,
      order_number: order.orderNumber || order.order_number,
      scheduled_date: order.scheduledDate || order.scheduled_date,
      scheduled_time: order.scheduledTime || order.scheduled_time,
      property_type: order.propertyType || order.property_type,
      square_feet: order.squareFeet || order.square_feet,
      stripe_payment_id: order.stripePaymentId || order.stripe_payment_id,
      additionalAppointments: order.additionalAppointments,
      customFields: order.customFields,
      customerNotes: order.customerNotes,
      internalNotes: order.internalNotes,
      mediaUploaded: order.mediaUploaded,
      mediaLinks: order.mediaLinks,
      drivingTimeMin: order.drivingTimeMin,
      previousLocation: order.previousLocation
    }));
    
    setOrders(mappedOrders);
  }, []);
  
  return { orders };
};
