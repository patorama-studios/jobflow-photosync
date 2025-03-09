
// Define the type for order status
export type OrderStatus = 
  | "scheduled" 
  | "completed" 
  | "pending" 
  | "canceled" 
  | "rescheduled" 
  | "in_progress"
  | "editing"
  | "review"
  | "delivered"
  | "cancelled"
  | "unavailable";

// Define the interface for an order
export interface Order {
  id: string | number;
  orderNumber: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  dateCreated?: string;
  scheduledDate: string;
  scheduledTime: string;
  photographer: string;
  package?: string;
  propertyType: string;
  squareFeet: number;
  price: number;
  status: OrderStatus;
  notes?: string;
  internalNotes?: string;
  customerNotes?: string;
  photographerPayoutRate?: number;
  photographerPayoutAmount?: number;
  stripePaymentId?: string;
  
  // Additional properties for older components
  drivingTimeMin?: number;
  previousLocation?: string;
  
  // Legacy property names for compatibility
  order_number?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  client_email?: string;
  client_phone?: string;
  property_type?: string;
  square_feet?: number;
  photographer_payout_rate?: number;
  photographer_payout_amount?: number;
  internal_notes?: string;
  customer_notes?: string;
  stripe_payment_id?: string;
  
  // Additional properties for compatibility with older components
  customerName?: string;
  propertyAddress?: string;
  amount?: number;
  completedDate?: string;
  products?: string[];
  contactNumber?: string;
  contactEmail?: string;
  type?: string;
  additionalAppointments?: any[];
  mediaLinks?: any[];
  mediaUploaded?: boolean;
}

// Define interface for Contractor
export interface Contractor {
  id: string;
  name: string;
  role: string;
  payoutRate?: number;
  payoutAmount?: number;
  notes?: string;
}

// Define interface for RefundRecord
export interface RefundRecord {
  id: string;
  amount: number;
  date: string;
  reason: string;
  isFullRefund: boolean;
  status: 'completed' | 'pending' | 'failed';
  stripeRefundId?: string;
}

// Define the interface for order filters
export interface OrderFilters {
  status?: OrderStatus[] | string;
  photographer?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  } | {
    from?: Date;
    to?: Date;
  };
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Define the interface for pagination
export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Define the interface for order statistics
export interface OrderStatistics {
  total: number;
  scheduled: number;
  completed: number;
  pending: number;
  canceled: number;
  revenue: number;
}
