
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
  clientEmail?: string; // Add clientEmail property
  clientPhone?: string; // Add clientPhone property
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
  photographer_payout_rate?: number;
  photographer_payout_amount?: number;
  stripePaymentId?: string; // Add stripePaymentId property
}

// Define the interface for order filters
export interface OrderFilters {
  status?: OrderStatus[];
  photographer?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
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
