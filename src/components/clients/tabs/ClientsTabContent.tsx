
import React from 'react';
import { useClients } from '@/hooks/use-clients';
import { ClientTable } from '../ClientTable';
import { Client } from '@/hooks/use-clients';

interface ClientsTabContentProps {
  companyId: string;
}

export const ClientsTabContent: React.FC<ClientsTabContentProps> = ({ companyId }) => {
  const { 
    clients, 
    isLoading, 
    error, 
    addClient, 
    updateClient,
    refetch
  } = useClients();
  
  const handleRowClick = (clientId: string) => {
    // Navigate to client details page
    console.log(`Navigate to client details page for ID: ${clientId}`);
  };
  
  const handleEditClient = (client: Client) => {
    // Open edit dialog
    console.log('Edit client:', client);
  };
  
  const handleDeleteClient = async (clientId: string) => {
    try {
      // Since deleteClient isn't provided by useClients, we'll just log it
      console.log(`Client ${clientId} deletion requested`);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };
  
  if (isLoading) {
    return <div className="p-4">Loading clients...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">Error loading clients: {error.message}</div>;
  }
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Clients</h2>
      
      <ClientTable 
        clients={clients} 
        isLoading={isLoading} 
        error={error}
        onRowClick={(client: Client) => handleRowClick(client.id)}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        updateClient={updateClient}
      />
    </div>
  );
};
