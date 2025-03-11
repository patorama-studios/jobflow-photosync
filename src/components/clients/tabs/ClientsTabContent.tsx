
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClientTable } from '../ClientTable';
import { useClients } from '@/hooks/use-clients';
import { ClientTableHeader } from '../table/ClientTableHeader';
import { Plus } from 'lucide-react';
import { AddClientDialog } from '@/components/calendar/appointment/components/AddClientDialog';

interface ClientsTabContentProps {
  companyId?: string;
  companyName?: string;
}

export function ClientsTabContent({ companyId, companyName }: ClientsTabContentProps) {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { clients, isLoading, error, refetch } = useClients(companyId);
  
  const handleAddClientClick = () => {
    setIsAddClientDialogOpen(true);
  };
  
  const handleClientAdded = async () => {
    // Refresh clients list after adding a new client
    await refetch();
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            {companyName ? `${companyName} Clients` : 'All Clients'}
          </h2>
          <p className="text-muted-foreground">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </p>
        </div>
        
        <Button 
          onClick={handleAddClientClick}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      <div className="border rounded-md">
        <ClientTableHeader />
        <ClientTable 
          clients={clients} 
          isLoading={isLoading} 
          error={error}
          companyId={companyId}
        />
      </div>
      
      {isAddClientDialogOpen && (
        <AddClientDialog
          open={isAddClientDialogOpen}
          onClose={() => setIsAddClientDialogOpen(false)}
          onClientCreated={async (client) => {
            await handleClientAdded();
            return client;
          }}
          companyId={companyId}
        />
      )}
    </div>
  );
}
