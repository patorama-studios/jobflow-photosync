
import { useState, useEffect } from 'react';

// Define client interface
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Sample client data
const sampleClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Real Estate',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    company: 'Summit Properties',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    company: 'Horizon Realty Group',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'inactive'
  }
];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // In a real application, this would fetch from an API
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setClients(sampleClients);
      } catch (err) {
        setError('Failed to fetch clients');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, isLoading, error };
}
