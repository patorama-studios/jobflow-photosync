
export type OrderStatus = 
  | "scheduled" 
  | "completed" 
  | "pending" 
  | "canceled" 
  | "cancelled" // Added for compatibility 
  | "rescheduled" 
  | "in_progress"
  | "editing"
  | "review"
  | "delivered";

export interface Order {
  id: string | number;
  customerName?: string;
  propertyAddress?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: OrderStatus;
  photographer: string;
  amount?: number;
  completedDate?: string;
  products?: string[];
  notes?: string;
  contactNumber?: string;
  contactEmail?: string;
  type?: string;
  
  // Required properties across all components
  orderNumber: string;
  order_number?: string;
  client: string;
  clientEmail?: string;
  client_email?: string;
  clientPhone?: string;
  client_phone?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  price: number; // Changed from optional to required
  propertyType: string;
  property_type?: string;
  squareFeet: number;
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
