
import { useState } from 'react';
import { useClients, Client } from '@/hooks/use-clients';
import { ClientTable } from '../ClientTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddClientDialog } from '../AddClientDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function ClientsTabContent() {
  const { clients, isLoading, addClient, updateClient, searchClients, refetch } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      await searchClients(e.target.value);
    } else if (e.target.value.length === 0) {
      await refetch();
    }
  };

  const handleRowClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
        
      if (error) throw error;
      
      await refetch();
      toast.success('Client has been deleted');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleClientAdded = async (client: any) => {
    try {
      const result = await addClient(client);
      if (result) {
        toast.success('Client has been added successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding client:", error);
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Input
            type="search"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={() => setIsAddClientDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <ClientTable 
        clients={clients} 
        isLoading={isLoading}
        onRowClick={handleRowClick}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        updateClient={updateClient}
      />
      
      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={setIsAddClientDialogOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
