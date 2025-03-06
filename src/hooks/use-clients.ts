
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

      setClients(data || []);
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

      setClients(prev => [data[0], ...prev]);
      toast.success("Client added successfully");
      return data[0];
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

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...data[0] } : client
      ));
      toast.success("Client updated successfully");
      return data[0];
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
