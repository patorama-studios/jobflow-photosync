// MySQL Database Types

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
  password_hash?: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  company_id?: string;
  photo_url?: string;
  status: string;
  outstanding_jobs?: number;
  outstanding_payment?: number;
  total_jobs?: number;
  created_at: Date;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  industry?: string;
  size?: string;
  annual_revenue?: number;
  credit_limit?: number;
  payment_terms?: number;
  tax_id?: string;
  billing_contact?: string;
  billing_email?: string;
  billing_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  client_id: string;
  company_id?: string;
  status: string;
  total_amount?: number;
  deposit_amount?: number;
  date: Date;
  time?: string;
  duration?: number;
  property_address?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  property_type?: string;
  square_footage?: number;
  bedrooms?: number;
  bathrooms?: number;
  lot_size?: number;
  year_built?: number;
  mls_number?: string;
  listing_agent?: string;
  listing_agent_phone?: string;
  listing_agent_email?: string;
  photographer_id?: string;
  notes?: string;
  special_instructions?: string;
  access_instructions?: string;
  drive_time?: number;
  travel_fee?: number;
  rush_fee?: number;
  weekend_fee?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  type: string;
  price?: number;
  duration?: number;
  is_addon: boolean;
  is_active: boolean;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  notes?: string;
  created_at: Date;
}

export interface Invoice {
  id: string;
  order_id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  tax_amount?: number;
  total_amount: number;
  status: string;
  due_date?: Date;
  paid_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: string;
  client_id: string;
  type: string;
  last_four?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  stripe_payment_method_id?: string;
  created_at: Date;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string | object;
  user_id?: string;
  is_global?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CompanyTeam {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  permissions?: string;
  joined_at: Date;
}

export interface ProductionStatus {
  id: string;
  name: string;
  description?: string;
  color?: string;
  sort_order?: number;
  is_active: boolean;
  created_at: Date;
}

export interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClientPhoto {
  id: string;
  client_id: string;
  photo_url: string;
  is_default?: boolean;
  created_at: Date;
}

export interface IntegrationSetting {
  id: string;
  integration_name: string;
  settings: string | object;
  is_enabled: boolean;
  user_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrganizationSetting {
  id: string;
  key: string;
  value: string | object;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaxSetting {
  id: string;
  name: string;
  rate: number;
  type: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: string;
  value: number;
  minimum_order_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ProductOverride {
  id: string;
  client_id: string;
  product_id: string;
  override_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AdditionalAppointment {
  id: string;
  order_id: string;
  date: Date;
  time: string;
  description?: string;
  created_at: Date;
}

export interface OrderActivity {
  id: string;
  order_id: string;
  activity_type: string;
  description: string;
  performed_by?: string;
  created_at: Date;
}

export interface OrderCommunication {
  id: string;
  order_id: string;
  message: string;
  sender_type: string;
  sender_id?: string;
  recipient_type: string;
  recipient_id?: string;
  created_at: Date;
}

export interface OrderPayout {
  id: string;
  order_id: string;
  contractor_id: string;
  amount: number;
  status: string;
  paid_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomField {
  id: string;
  order_id: string;
  field_name: string;
  field_value: string;
  field_type: string;
  created_at: Date;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: string;
  permissions?: string;
  status: string;
  invited_by: string;
  expires_at: Date;
  created_at: Date;
}

export interface EsoftSetting {
  id: string;
  api_key: string;
  api_secret: string;
  base_url: string;
  is_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

// View Types
export interface BillingSummary {
  client_id: string;
  client_name: string;
  total_orders: number;
  total_amount: number;
  total_paid: number;
  outstanding_amount: number;
}

// Database operation types
export interface DatabaseInsert<T> {
  table: string;
  data: Partial<T>;
}

export interface DatabaseUpdate<T> {
  table: string;
  data: Partial<T>;
  where: Record<string, any>;
}

export interface DatabaseSelect {
  table: string;
  columns?: string[];
  where?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}