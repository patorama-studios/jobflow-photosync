
export type Order = {
  id: string;
  order_number: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  client: string;
  client_email: string;
  client_phone?: string;
  photographer?: string;
  photographer_payout_rate?: number;
  price: number;
  property_type: string;
  scheduled_date: string;
  scheduled_time: string;
  square_feet: number;
  status: 'pending' | 'scheduled' | 'completed';
  notes?: string;
  customer_notes?: string;
  internal_notes?: string;
  package: string;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  additionalAppointments?: Array<{
    id: string;
    date: string;
    time: string;
    description?: string;
  }>;
  customFields?: Record<string, string>;
}

export type OrderFilters = {
  query: string;
  setQuery: (query: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  setDateRange: (dateRange: { from?: Date; to?: Date }) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  resetFilters: () => void;
}
