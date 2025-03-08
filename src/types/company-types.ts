
// Define company interface
export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  industry: string;
  logo_url?: string;
  created_at: string;
  status: 'active' | 'inactive';
  open_jobs: number;
  total_jobs: number;
  outstanding_amount: number;
  total_revenue: number;
}

// Type for company data from Supabase
export interface CompanyResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website: string | null;
  industry: string;
  logo_url: string | null;
  created_at: string;
  status: string;
  open_jobs: number | null;
  total_jobs: number | null;
  outstanding_amount: number | null;
  total_revenue: number | null;
}
