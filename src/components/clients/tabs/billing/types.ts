
export interface Invoice {
  id: string;
  client_id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  order_number: string;
  created_at?: string;
}

export interface ProductOverride {
  id: string;
  client_id: string;
  name: string;
  standard_price: number;
  override_price: number;
  discount: string;
  created_at?: string;
}

export interface PaymentMethod {
  id: string;
  client_id: string;
  card_type: string;
  last_four: string;
  expiry_date: string;
  is_default: boolean;
  created_at?: string;
}

export interface BillingSummary {
  client_id: string;
  client_name: string;
  total_billed: number;
  last_payment_amount: number;
  last_payment_date: string | null;
  outstanding_payment: number;
}
