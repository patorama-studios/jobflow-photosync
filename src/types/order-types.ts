
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
  orderNumber?: string;
  order_number?: string;
  client?: string;
  clientEmail?: string;
  client_email?: string;
  clientPhone?: string;
  client_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  price?: number;
  propertyType?: string;
  property_type?: string;
  squareFeet?: number;
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
}
