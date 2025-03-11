
import React from 'react';
import { ClientTableHeader } from './table/ClientTableHeader';
import { ClientTableContent } from './table/ClientTableContent';
import { ClientTableSkeleton } from './table/ClientTableSkeleton';
import { Client } from '@/types/company-types';

export interface ClientTableContentProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => Promise<void>;
  onRowClick: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
}

export interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => Promise<void>;
  onRowClick: (client: Client) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  isLoading,
  error,
  updateClient,
  onEdit,
  onDelete,
  onRowClick
}) => {
  if (isLoading) {
    return <ClientTableSkeleton rows={5} />;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading clients: {error.message}</div>;
  }

  // This is a placeholder - you'd implement these functions in the actual component
  const dummySearchQuery = "";
  const setSearchQuery = (query: string) => {};
  const handleAddClient = () => {};
  const handleExport = () => {};

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <ClientTableHeader 
          searchQuery={dummySearchQuery}
          setSearchQuery={setSearchQuery}
          onAddClient={handleAddClient}
          onExport={handleExport}
        />
        <ClientTableContent 
          clients={clients} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onRowClick={onRowClick}
          updateClient={updateClient}
        />
      </table>
    </div>
  );
};
