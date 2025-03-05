
export interface OrderFiltersState {
  dateRangeCreated?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  appointmentDateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  orderStatus?: string;
  paymentStatus?: string;
  orderItems?: string;
  sortDirection: 'asc' | 'desc';
}
