import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, subDays } from 'date-fns';

// Interface for the Order in this hook
export interface Order {
  id: string | number;
  orderNumber: string;
  address: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  photographer: string;
  photographerPayoutRate?: number;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: string;
  additionalAppointments?: {
    date: string;
    time: string;
    description: string;
  }[];
  customFields?: Record<string, string>;
  customerNotes?: string;
  internalNotes?: string;
  mediaUploaded?: boolean;
  mediaLinks?: string[];
  drivingTimeMin?: number;
  previousLocation?: string;
  city?: string;
  state?: string;
  zip?: string;
  package?: string;
  stripePaymentId?: string;
  
  // Legacy property names for compatibility
  order_number?: string;
  client_email?: string;
  client_phone?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  property_type?: string;
  square_feet?: number;
  photographer_payout_rate?: number;
  internal_notes?: string;
  customer_notes?: string;
  stripe_payment_id?: string;
}

export function useSampleOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // First try to fetch from Supabase
        const { data: supabaseOrders, error } = await supabase
          .from('orders')
          .select('*');

        if (error) {
          console.error('Error fetching from Supabase:', error);
          throw new Error(error.message);
        }

        if (supabaseOrders && supabaseOrders.length > 0) {
          // Map Supabase orders to our Order format
          const mappedOrders = supabaseOrders.map((order): Order => ({
            id: order.id,
            orderNumber: order.order_number,
            order_number: order.order_number,
            client: order.client,
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
            city: order.city || '',
            state: order.state || '',
            zip: order.zip || '',
            package: order.package || '',
            customerNotes: order.customer_notes || '',
            customer_notes: order.customer_notes || '',
            internalNotes: order.internal_notes || '',
            internal_notes: order.internal_notes || '',
            drivingTimeMin: 15 + Math.floor(Math.random() * 30) // Random driving time
          }));

          console.log('Fetched orders from Supabase:', mappedOrders);
          setOrders(mappedOrders);
        } else {
          // Fallback to sample data if no Supabase data
          console.warn('No orders found in Supabase, using fallback data');
          throw new Error('No orders found');
        }
      } catch (err) {
        console.error('Error in useSampleOrders:', err);
        // Use local data as fallback
        const sampleData = generateSampleOrders();
        setOrders(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
}

// Fallback sample data generator
function generateSampleOrders(): Order[] {
  const today = new Date();
  return [
    {
      id: 1,
      orderNumber: "ORD-2023-001",
      order_number: "ORD-2023-001",
      address: "123 Maple Street, Seattle, WA 98101",
      client: "John Smith - ABC Realty",
      photographer: "Alex Johnson",
      photographerPayoutRate: 95,
      photographer_payout_rate: 95,
      price: 149,
      propertyType: "Residential",
      property_type: "Residential",
      scheduledDate: format(today, 'yyyy-MM-dd'),
      scheduled_date: format(today, 'yyyy-MM-dd'),
      scheduledTime: "10:00 AM",
      scheduled_time: "10:00 AM",
      squareFeet: 1800,
      square_feet: 1800,
      status: "completed",
      drivingTimeMin: 25,
      previousLocation: "Office",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      package: "Basic Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: ""
    },
    {
      id: 2,
      orderNumber: "ORD-2023-002",
      order_number: "ORD-2023-002",
      address: "456 Oak Avenue, Seattle, WA 98102",
      client: "Sarah Johnson - Johnson Properties",
      photographer: "Maria Garcia",
      photographerPayoutRate: 120,
      photographer_payout_rate: 120,
      price: 199,
      propertyType: "Commercial",
      property_type: "Commercial",
      scheduledDate: format(addDays(today, 1), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 1), 'yyyy-MM-dd'),
      scheduledTime: "2:00 PM",
      scheduled_time: "2:00 PM",
      squareFeet: 2500,
      square_feet: 2500,
      status: "scheduled",
      drivingTimeMin: 20,
      city: "Seattle",
      state: "WA",
      zip: "98102",
      package: "Premium Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: ""
    },
    {
      id: 3,
      orderNumber: "ORD-2023-003",
      order_number: "ORD-2023-003",
      address: "789 Pine Boulevard, Bellevue, WA 98004",
      client: "Michael Williams - Luxury Homes",
      photographer: "Wei Chen",
      photographerPayoutRate: 150,
      photographer_payout_rate: 150,
      price: 249,
      propertyType: "Residential",
      property_type: "Residential",
      scheduledDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 2), 'yyyy-MM-dd'),
      scheduledTime: "11:30 AM",
      scheduled_time: "11:30 AM",
      squareFeet: 3200,
      square_feet: 3200,
      status: "scheduled",
      drivingTimeMin: 35,
      city: "Bellevue",
      state: "WA",
      zip: "98004",
      package: "Deluxe Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: ""
    },
    {
      id: 4,
      orderNumber: "ORD-2023-004",
      order_number: "ORD-2023-004",
      address: "321 Cedar Road, Redmond, WA 98052",
      client: "Emily Davis - Modern Living",
      photographer: "Priya Patel",
      photographerPayoutRate: 85,
      photographer_payout_rate: 85,
      price: 149,
      propertyType: "Apartment",
      property_type: "Apartment",
      scheduledDate: format(addDays(today, 3), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 3), 'yyyy-MM-dd'),
      scheduledTime: "9:00 AM",
      scheduled_time: "9:00 AM",
      squareFeet: 1200,
      square_feet: 1200,
      status: "pending",
      drivingTimeMin: 15,
      city: "Redmond",
      state: "WA",
      zip: "98052",
      package: "Basic Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: ""
    },
    {
      id: 5,
      orderNumber: "ORD-2023-005",
      order_number: "ORD-2023-005",
      address: "654 Birch Lane, Kirkland, WA 98033",
      client: "David Wilson - Wilson Realty",
      photographer: "Thomas Wilson",
      photographerPayoutRate: 110,
      photographer_payout_rate: 110,
      price: 199,
      propertyType: "Condo",
      property_type: "Condo",
      scheduledDate: format(subDays(today, 1), 'yyyy-MM-dd'),
      scheduled_date: format(subDays(today, 1), 'yyyy-MM-dd'),
      scheduledTime: "3:30 PM",
      scheduled_time: "3:30 PM",
      squareFeet: 1600,
      square_feet: 1600,
      status: "completed",
      drivingTimeMin: 30,
      city: "Kirkland",
      state: "WA",
      zip: "98033",
      package: "Premium Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: ""
    }
  ];
}

// Export the Order type for use in other files
