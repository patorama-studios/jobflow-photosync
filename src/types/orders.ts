
export interface Order {
  id: string | number;
  orderNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  client: string;
  clientEmail: string;
  clientPhone?: string;
  photographer?: string;
  photographerPayoutRate?: number;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: 'pending' | 'scheduled' | 'completed';
  additionalAppointments?: Array<{
    id: string | number;
    date: string;
    time: string;
    description: string;
  }>;
  customFields?: Record<string, any>;
  customerNotes?: string;
  internalNotes?: string;
  package: string;
  drivingTimeMin?: number;
  previousLocation?: string;
  mediaUploaded?: boolean;
  mediaLinks?: string[];
  contractors?: Array<{
    id: string | number;
    name: string;
    role: string;
    payoutRate?: number;
    payoutAmount?: number;
    notes?: string;
  }>;
  refundHistory?: RefundRecord[];
  paymentStatus?: 'paid' | 'unpaid' | 'partially_refunded' | 'fully_refunded';
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  stripePaymentId?: string;
}

export interface RefundRecord {
  id: string | number;
  amount: number;
  date: string;
  reason?: string;
  status: 'pending' | 'completed' | 'failed';
  stripeRefundId?: string;
  isFullRefund: boolean;
}

export interface OrderFilters {
  query: string;
  setQuery: (query: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (dateRange: { from?: Date; to?: Date }) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  resetFilters: () => void;
}

export interface OrderActionsProps {
  orderId: string | number;
}

export interface Contractor {
  id: string | number;
  name: string;
  role: string;
  payoutRate?: number;
  payoutAmount?: number;
  notes?: string;
}
