
export interface Order {
  id: string | number;
  customerName?: string;
  propertyAddress?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  photographer: string;
  amount?: number;
  completedDate?: string;
  products?: string[];
  notes?: string;
  contactNumber?: string;
  contactEmail?: string;
  type?: string;
  
  // Additional properties needed by various components
  orderNumber: string; // Make this required to match orders.ts
  order_number?: string;
  client: string; // Make this required to match orders.ts
  clientEmail?: string;
  client_email?: string;
  clientPhone?: string;
  client_phone?: string;
  address: string; // Make this required to match orders.ts
  city?: string;
  state?: string;
  zip?: string;
  price?: number;
  propertyType: string; // Make this required to match orders.ts
  property_type?: string;
  squareFeet: number; // Make this required to match orders.ts
  square_feet?: number;
  package?: string;
  drivingTimeMin?: number;
  previousLocation?: string;
  photographerPayoutRate?: number;
  photographer_payout_rate?: number;
  internalNotes?: string;
  internal_notes?: string;
  customerNotes?: string;
  customer_notes?: string;
  stripePaymentId?: string;
  stripe_payment_id?: string;
  additionalAppointments?: any[];
  mediaLinks?: any[];
  mediaUploaded?: boolean;
  
  // Add both formats for consistent access
  scheduled_date?: string;
  scheduled_time?: string;
}
