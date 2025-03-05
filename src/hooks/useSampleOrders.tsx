
import { useState, useEffect } from 'react';
import { generateSampleOrders } from '@/data/sampleOrders';

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
    // Load sample data
    const sampleOrders = generateSampleOrders();
    setOrders(sampleOrders);
  }, []);
  
  return { orders };
};
