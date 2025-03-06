
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
  clientEmail?: string;
  clientPhone?: string;
  stripePaymentId?: string;
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
      orderNumber: order.orderNumber || '',
      address: order.address,
      client: order.client,
      photographer: order.photographer,
      photographerPayoutRate: order.photographerPayoutRate || 0,
      price: order.price,
      propertyType: order.propertyType || '',
      scheduledDate: order.scheduledDate || '',
      scheduledTime: order.scheduledTime || '',
      squareFeet: order.squareFeet || 0,
      status: order.status as 'pending' | 'scheduled' | 'completed',
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      stripePaymentId: order.stripePaymentId,
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
