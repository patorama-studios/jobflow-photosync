
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ClientTable } from '../ClientTable';
import { ClientTableContent } from '../table/ClientTableContent';
import { AddClientDialog } from '../AddClientDialog';
import { useClients } from '@/hooks/use-clients';

interface ClientsTabContentProps {
  companyId?: string;
}

export const ClientsTabContent: React.FC<ClientsTabContentProps> = ({ companyId }) => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { clients, isLoading, refetch } = useClients(companyId);

  // Count clients for pagination (simplified version)
  const totalClients = clients?.length || 0;

  // Handle success of client addition - returns a Promise<boolean>
  const handleClientAdded = async () => {
    await refetch();
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {companyId ? 'Company Clients' : 'All Clients'}
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsAddClientDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card className="overflow-hidden">
        {clients && clients.length > 0 ? (
          <ClientTableContent 
            clients={clients} 
            isLoading={isLoading}
            totalClients={totalClients}
          />
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-medium text-lg">No clients found</h3>
            <p className="text-muted-foreground mt-1">
              Get started by adding your first client
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddClientDialogOpen(true)}
              className="mt-4"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Client
            </Button>
          </div>
        )}
      </Card>

      {isAddClientDialogOpen && (
        <AddClientDialog
          isOpen={isAddClientDialogOpen}
          onClose={() => setIsAddClientDialogOpen(false)}
          companyId={companyId}
          onClientAdded={handleClientAdded}
        />
      )}
    </div>
  );
};
