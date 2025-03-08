
import { useState, useEffect } from 'react';
import { Company } from '@/types/company-types';
import { fetchCompaniesFromApi, addCompanyToApi, updateCompanyInApi } from '@/services/company-service';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const companiesData = await fetchCompaniesFromApi();
      setCompanies(companiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch companies');
      console.error('Error fetching companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addCompany = async (newCompany: Omit<Company, 'id' | 'created_at'>) => {
    try {
      const addedCompany = await addCompanyToApi(newCompany);
      setCompanies(prev => [addedCompany, ...prev]);
      return addedCompany;
    } catch (err: any) {
      console.error('Error adding company:', err);
      throw err;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const updatedCompany = await updateCompanyInApi(id, updates);
      setCompanies(prev => prev.map(company => 
        company.id === id ? updatedCompany : company
      ));
      return updatedCompany;
    } catch (err: any) {
      console.error('Error updating company:', err);
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

// Re-export the Company type for convenience
export type { Company } from '@/types/company-types';
