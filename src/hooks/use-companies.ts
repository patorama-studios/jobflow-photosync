
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

      setCompanies(data || []);
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

      setCompanies(prev => [data[0], ...prev]);
      toast.success("Company added successfully");
      return data[0];
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

      setCompanies(prev => prev.map(company => 
        company.id === id ? { ...company, ...data[0] } : company
      ));
      toast.success("Company updated successfully");
      return data[0];
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
