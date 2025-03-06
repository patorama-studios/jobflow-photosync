
import { useState, useEffect } from 'react';

// Define company interface
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  totalOrders?: number;
  activeOrders?: number;
}

// Sample company data
const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Real Estate',
    email: 'info@acme-realty.com',
    phone: '(555) 987-6543',
    address: '123 Main St, Suite 100',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    website: 'https://acme-realty.com',
    createdAt: new Date().toISOString(),
    status: 'active',
    totalOrders: 24,
    activeOrders: 5
  },
  {
    id: '2',
    name: 'Summit Properties',
    email: 'contact@summitproperties.com',
    phone: '(555) 123-4567',
    address: '456 Oak Ave',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    website: 'https://summitproperties.com',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalOrders: 18,
    activeOrders: 3
  },
  {
    id: '3',
    name: 'Horizon Realty Group',
    email: 'sales@horizonrealty.com',
    phone: '(555) 789-0123',
    address: '789 Pine St',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    website: 'https://horizonrealty.com',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'inactive',
    totalOrders: 7,
    activeOrders: 0
  }
];

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // In a real application, this would fetch from an API
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCompanies(sampleCompanies);
      } catch (err) {
        setError('Failed to fetch companies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, isLoading, error };
}
