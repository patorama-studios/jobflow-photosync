
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ClientTable } from './ClientTable';
import { AddClientDialog } from './AddClientDialog';
import { useClients } from '@/hooks/use-clients';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

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
    // Handle client deletion (future implementation)
    toast({
      title: "Client deleted",
      description: "The client has been removed"
    });
  };

  const handleEditClient = (client: any) => {
    // Open client details page
    navigate(`/clients/${client.id}`);
  };

  const handleRowClick = (client: any) => {
    navigate(`/clients/${client.id}`);
  };

  const handleClientAdded = async (client: any) => {
    try {
      const result = await addClient(client);
      if (result) {
        toast({
          title: "Client added",
          description: "The client has been added successfully"
        });
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
          error={error} 
          updateClient={updateClient}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onRowClick={handleRowClick}
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
