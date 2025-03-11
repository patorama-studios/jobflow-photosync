
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, PlusCircle } from 'lucide-react';
import { ClientTable } from '@/components/clients/ClientTable';
import { useClients, Client } from '@/hooks/use-clients';
import { AddClientDialog } from '@/components/calendar/appointment/components/AddClientDialog';

interface ClientsTabContentProps {
  title?: string;
  companyId?: string;
  onClientClick?: (clientId: string) => void;
}

export const ClientsTabContent: React.FC<ClientsTabContentProps> = ({
  title = 'Clients',
  companyId,
  onClientClick
}) => {
  const { clients, isLoading, error, addClient, refetch } = useClients();
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);

  const handleClientAdded = async (client: Client) => {
    try {
      await addClient({
        ...client,
        companyId: companyId || null
      });
      
      await refetch();
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      return false;
    }
  };

  const handleClientClick = (clientId: string) => {
    if (onClientClick) {
      onClientClick(clientId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setAddClientDialogOpen(true)}
          className="flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <ClientTable 
        clients={clients}
        isLoading={isLoading}
        error={error}
        onRowClick={handleClientClick}
      />

      {addClientDialogOpen && (
        <AddClientDialog
          open={addClientDialogOpen}
          onClose={() => setAddClientDialogOpen(false)}
          onClientCreated={handleClientAdded}
        />
      )}
    </div>
  );
};
