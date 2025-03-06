
// Define the interface for Order
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
  notes?: string;
  stripe_payment_id?: string; // Adding this to match the Supabase response structure
  
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
}
