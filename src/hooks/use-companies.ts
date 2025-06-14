
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { companyService, Company, CompanyStatus } from '@/services/mysql/company-service';

// Re-export types for compatibility
export type { Company, CompanyStatus } from '@/services/mysql/company-service';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      console.log('🔧 useCompanies: Fetching companies from MySQL');
      
      const companiesData = await companyService.getAllCompanies();
      console.log('🔧 useCompanies: Companies loaded:', companiesData.length);
      
      setCompanies(companiesData);
      setError(null);
    } catch (err: any) {
      console.error('🔧 useCompanies: Error fetching companies:', err);
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
      console.log('🔧 useCompanies: Adding new company');
      
      const newCompany = await companyService.addCompany(company);
      
      if (newCompany) {
        setCompanies([...companies, newCompany]);
        toast.success('Company added successfully');
        console.log('🔧 useCompanies: Company added successfully');
        return newCompany;
      } else {
        throw new Error('Failed to add company');
      }
    } catch (err) {
      console.error('🔧 useCompanies: Error adding company:', err);
      toast.error('Failed to add company');
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      console.log('🔧 useCompanies: Updating company:', id);
      
      const updatedCompany = await companyService.updateCompany(id, updates);
      
      if (updatedCompany) {
        setCompanies(companies.map(company => 
          company.id === id ? updatedCompany : company
        ));
        toast.success('Company updated successfully');
        console.log('🔧 useCompanies: Company updated successfully');
      } else {
        throw new Error('Failed to update company');
      }
    } catch (err) {
      console.error('🔧 useCompanies: Error updating company:', err);
      toast.error('Failed to update company');
      throw err;
    }
  };

  const searchCompanies = async (query: string): Promise<Company[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      console.log('🔧 useCompanies: Searching companies:', query);
      
      const results = await companyService.searchCompanies(query);
      
      console.log('🔧 useCompanies: Search results:', results.length);
      return results;
    } catch (err) {
      console.error('🔧 useCompanies: Error searching companies:', err);
      return [];
    }
  };

  // Add refetch function to reload company data
  const refetch = () => {
    return fetchCompanies();
  };

  return { companies, isLoading, error, addCompany, updateCompany, searchCompanies, refetch };
};
