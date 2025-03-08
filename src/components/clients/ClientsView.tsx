import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ClientTable } from './ClientTable';
import { AddClientDialog } from './AddClientDialog';
import { useClients } from '@/hooks/use-clients';

export function ClientsView() {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, isLoading, error, addClient, updateClient, searchClients, refetch } = useClients();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      await searchClients(e.target.value);
    } else if (e.target.value.length === 0) {
      await refetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <Button onClick={() => setIsAddClientDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <ClientTable clients={clients} isLoading={isLoading} error={error} updateClient={updateClient} />
      <AddClientDialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen} addClient={addClient} />
    </div>
  );
}
