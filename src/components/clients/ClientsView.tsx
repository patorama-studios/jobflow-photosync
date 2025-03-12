
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ClientTable } from './ClientTable';
import { AddClientDialog } from './AddClientDialog';
import { useClients, Client } from '@/hooks/use-clients';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function ClientsView() {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, isLoading, error, addClient, updateClient, searchClients, refetch } = useClients();
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      await searchClients(e.target.value);
    } else if (e.target.value.length === 0) {
      await refetch();
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      // Permanently delete the client from the database
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);
        
      if (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
        return;
      }
      
      // Update local state by removing the deleted client
      await refetch();
      toast.success('Client has been deleted');
    } catch (error) {
      console.error('Unexpected error deleting client:', error);
      toast.error('An unexpected error occurred while deleting the client');
    }
  };

  const handleEditClient = (client: Client) => {
    // Open client details page
    navigate(`/clients/${client.id}`);
  };

  const handleRowClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
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
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Clients</CardTitle>
            <CardDescription>Manage your clients and their information</CardDescription>
          </div>
          <Button onClick={() => setIsAddClientDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Input
            type="search"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <ClientTable 
          clients={clients} 
          isLoading={isLoading} 
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onRowClick={handleRowClick}
          updateClient={updateClient}
        />
      </CardContent>
      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={setIsAddClientDialogOpen} 
        onClientAdded={handleClientAdded}
      />
    </Card>
  );
}
