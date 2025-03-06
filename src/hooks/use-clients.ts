
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define client interface
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  company_id?: string;
  photo_url?: string;
  created_at: string;
  status: 'active' | 'inactive';
  total_jobs: number;
  outstanding_jobs: number;
  outstanding_payment: number;
}

// Type for client data from Supabase
interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  company_id: string | null;
  photo_url: string | null;
  created_at: string;
  status: string;
  total_jobs: number | null;
  outstanding_jobs: number | null;
  outstanding_payment: number | null;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert database response to Client type
      const typedClients: Client[] = (data || []).map((client: ClientResponse) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone || undefined,
        company: client.company || undefined,
        company_id: client.company_id || undefined,
        photo_url: client.photo_url || undefined,
        created_at: client.created_at,
        status: (client.status === 'active' || client.status === 'inactive') 
          ? client.status 
          : 'active',
        total_jobs: client.total_jobs || 0,
        outstanding_jobs: client.outstanding_jobs || 0,
        outstanding_payment: client.outstanding_payment || 0
      }));

      setClients(typedClients);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (newClient: Omit<Client, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select();

      if (error) {
        throw error;
      }

      // Convert the response to Client type
      const addedClient: Client = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone || undefined,
        company: data[0].company || undefined,
        company_id: data[0].company_id || undefined,
        photo_url: data[0].photo_url || undefined,
        created_at: data[0].created_at,
        status: (data[0].status === 'active' || data[0].status === 'inactive') 
          ? data[0].status 
          : 'active',
        total_jobs: data[0].total_jobs || 0,
        outstanding_jobs: data[0].outstanding_jobs || 0,
        outstanding_payment: data[0].outstanding_payment || 0
      };

      setClients(prev => [addedClient, ...prev]);
      toast.success("Client added successfully");
      return addedClient;
    } catch (err: any) {
      toast.error("Failed to add client: " + err.message);
      console.error(err);
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

      if (error) {
        throw error;
      }

      // Convert the response to Client type
      const updatedClient: Client = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone || undefined,
        company: data[0].company || undefined,
        company_id: data[0].company_id || undefined,
        photo_url: data[0].photo_url || undefined,
        created_at: data[0].created_at,
        status: (data[0].status === 'active' || data[0].status === 'inactive') 
          ? data[0].status 
          : 'active',
        total_jobs: data[0].total_jobs || 0,
        outstanding_jobs: data[0].outstanding_jobs || 0,
        outstanding_payment: data[0].outstanding_payment || 0
      };

      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      toast.success("Client updated successfully");
      return updatedClient;
    } catch (err: any) {
      toast.error("Failed to update client: " + err.message);
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    refetch: fetchClients,
    addClient,
    updateClient
  };
}
