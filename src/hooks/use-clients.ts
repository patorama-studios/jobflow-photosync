
import { useState, useEffect } from 'react';
import { clientService, Client, ClientStatus } from '@/services/mysql/client-service';

// Re-export types for compatibility
export type { Client, ClientStatus } from '@/services/mysql/client-service';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      console.log('🔧 useClients: Fetching clients from MySQL');
      
      const clientsData = await clientService.getAllClients();
      console.log('🔧 useClients: Clients loaded:', clientsData.length);
      
      setClients(clientsData);
      setError(null);
    } catch (err: any) {
      console.error('🔧 useClients: Error fetching clients:', err);
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
      console.log('🔧 useClients: Adding new client');
      
      const newClient = await clientService.addClient(client);
      
      if (newClient) {
        setClients([...clients, newClient]);
        console.log('🔧 useClients: Client added successfully');
        return newClient;
      }
      
      return null;
    } catch (err) {
      console.error('🔧 useClients: Error adding client:', err);
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      console.log('🔧 useClients: Updating client:', id);
      
      const updatedClient = await clientService.updateClient(id, updates);
      
      if (updatedClient) {
        setClients(clients.map(client => 
          client.id === id ? updatedClient : client
        ));
        console.log('🔧 useClients: Client updated successfully');
      }
    } catch (err) {
      console.error('🔧 useClients: Error updating client:', err);
      throw err;
    }
  };

  const searchClients = async (query: string): Promise<Client[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      console.log('🔧 useClients: Searching clients:', query);
      
      const results = await clientService.searchClients(query);
      
      console.log('🔧 useClients: Search results:', results.length);
      return results;
    } catch (err) {
      console.error('🔧 useClients: Error searching clients:', err);
      return [];
    }
  };

  // Add refetch function to reload client data
  const refetch = () => {
    return fetchClients();
  };

  return { clients, isLoading, error, addClient, updateClient, searchClients, refetch };
};
