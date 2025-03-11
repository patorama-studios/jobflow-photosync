
import React from 'react';
import { useClient } from '@/hooks/use-clients';
import { ClientTable } from '../ClientTable';
import { Client } from '@/types/company-types';

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
    deleteClient 
  } = useClient(companyId);
  
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
      await deleteClient(clientId);
      console.log(`Client ${clientId} deleted successfully`);
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
