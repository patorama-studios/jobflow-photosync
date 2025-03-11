
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CompanyStatus = 'active' | 'inactive';

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: CompanyStatus;
  industry: string;
  logo_url?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  total_jobs?: number;
  open_jobs?: number;
  total_revenue?: number;
  outstanding_amount?: number;
  created_at: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;

      // Transform the data to match our Company interface
      const formattedCompanies = data.map((company: any) => ({
        ...company,
        status: company.status as CompanyStatus || 'active'
      }));

      setCompanies(formattedCompanies);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async (company: Omit<Company, 'id' | 'created_at'>) => {
    try {
      const newCompany = {
        ...company,
        created_at: new Date().toISOString(),
        status: company.status || 'active',
        industry: company.industry || 'real estate'
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(newCompany)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCompanies([...companies, data[0] as Company]);
        return data[0] as Company;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding company:', err);
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

      if (error) throw error;

      if (data) {
        setCompanies(companies.map(company => 
          company.id === id ? { ...company, ...updates } : company
        ));
      }
    } catch (err) {
      console.error('Error updating company:', err);
      throw err;
    }
  };

  const searchCompanies = async (query: string): Promise<Company[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name')
        .limit(10);

      if (error) throw error;

      // Transform the data to match our Company interface
      const results = data.map((company: any) => ({
        ...company,
        status: company.status as CompanyStatus || 'active'
      }));
      
      return results;
    } catch (err) {
      console.error('Error searching companies:', err);
      return [];
    }
  };

  // Add refetch function to reload company data
  const refetch = () => {
    return fetchCompanies();
  };

  return { companies, isLoading, error, addCompany, updateCompany, searchCompanies, refetch };
};
