
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  company?: string;
  company_id?: string;
  photo_url?: string;
  created_at?: string;
  outstanding_jobs?: number;
  outstanding_payment?: number;
  total_jobs?: number;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;

      // Transform the data to match our Client interface
      const formattedClients = data.map((client: any) => ({
        ...client,
        status: client.status as ClientStatus || 'active'
      }));

      setClients(formattedClients);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const newClient = {
        ...client,
        created_at: new Date().toISOString(),
        status: client.status || 'active'
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setClients([...clients, data[0] as Client]);
        return data[0] as Client;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data) {
        setClients(clients.map(client => 
          client.id === id ? { ...client, ...updates } : client
        ));
      }
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const searchClients = async (query: string): Promise<Client[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name')
        .limit(10);

      if (error) throw error;

      // Transform the data to match our Client interface
      const results = data.map((client: any) => ({
        ...client,
        status: client.status as ClientStatus || 'active'
      }));
      
      // Update the local state with the search results
      setClients(results);
      
      return results;
    } catch (err) {
      console.error('Error searching clients:', err);
      return [];
    }
  };

  // Add refetch function to reload client data
  const refetch = () => {
    return fetchClients();
  };

  return { clients, isLoading, error, addClient, updateClient, searchClients, refetch };
};
