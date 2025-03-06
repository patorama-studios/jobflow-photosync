
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
interface CompanyResponse {
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

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert database response to Company type
      const typedCompanies: Company[] = (data || []).map((company: CompanyResponse) => ({
        id: company.id,
        name: company.name,
        email: company.email || undefined,
        phone: company.phone || undefined,
        address: company.address || undefined,
        city: company.city || undefined,
        state: company.state || undefined,
        zip: company.zip || undefined,
        website: company.website || undefined,
        industry: company.industry,
        logo_url: company.logo_url || undefined,
        created_at: company.created_at,
        status: (company.status === 'active' || company.status === 'inactive') 
          ? company.status 
          : 'active',
        open_jobs: company.open_jobs || 0,
        total_jobs: company.total_jobs || 0,
        outstanding_amount: company.outstanding_amount || 0,
        total_revenue: company.total_revenue || 0
      }));

      setCompanies(typedCompanies);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch companies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addCompany = async (newCompany: Omit<Company, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select();

      if (error) {
        throw error;
      }

      // Convert the response to Company type
      const addedCompany: Company = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email || undefined,
        phone: data[0].phone || undefined,
        address: data[0].address || undefined,
        city: data[0].city || undefined,
        state: data[0].state || undefined,
        zip: data[0].zip || undefined,
        website: data[0].website || undefined,
        industry: data[0].industry,
        logo_url: data[0].logo_url || undefined,
        created_at: data[0].created_at,
        status: (data[0].status === 'active' || data[0].status === 'inactive') 
          ? data[0].status 
          : 'active',
        open_jobs: data[0].open_jobs || 0,
        total_jobs: data[0].total_jobs || 0,
        outstanding_amount: data[0].outstanding_amount || 0,
        total_revenue: data[0].total_revenue || 0
      };

      setCompanies(prev => [addedCompany, ...prev]);
      toast.success("Company added successfully");
      return addedCompany;
    } catch (err: any) {
      toast.error("Failed to add company: " + err.message);
      console.error(err);
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Convert the response to Company type
      const updatedCompany: Company = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email || undefined,
        phone: data[0].phone || undefined,
        address: data[0].address || undefined,
        city: data[0].city || undefined,
        state: data[0].state || undefined,
        zip: data[0].zip || undefined,
        website: data[0].website || undefined,
        industry: data[0].industry,
        logo_url: data[0].logo_url || undefined,
        created_at: data[0].created_at,
        status: (data[0].status === 'active' || data[0].status === 'inactive') 
          ? data[0].status 
          : 'active',
        open_jobs: data[0].open_jobs || 0,
        total_jobs: data[0].total_jobs || 0,
        outstanding_amount: data[0].outstanding_amount || 0,
        total_revenue: data[0].total_revenue || 0
      };

      setCompanies(prev => prev.map(company => 
        company.id === id ? updatedCompany : company
      ));
      toast.success("Company updated successfully");
      return updatedCompany;
    } catch (err: any) {
      toast.error("Failed to update company: " + err.message);
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { 
    companies, 
    isLoading, 
    error, 
    refetch: fetchCompanies,
    addCompany,
    updateCompany
  };
}
