
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
  | "delivered";

// Define the interface for an order
export interface Order {
  id: string;
  order_number: string;
  client: string;
  client_email?: string;
  client_phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date_created?: string;
  scheduled_date: string;
  scheduled_time: string;
  photographer: string;
  package: string;
  property_type: string;
  square_feet: number;
  price: number;
  status: OrderStatus;
  notes?: string;
  internal_notes?: string;
  customer_notes?: string;
  photographer_payout_rate?: number;
  photographer_payout_amount?: number;
  stripe_payment_id?: string;
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
