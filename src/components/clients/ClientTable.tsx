
import React from 'react';
import { ClientTableHeader } from './table/ClientTableHeader';
import { ClientTableContent } from './table/ClientTableContent';
import { ClientTableSkeleton } from './table/ClientTableSkeleton';
import { Client } from '@/types/company-types';

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
    return <ClientTableSkeleton />;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading clients: {error.message}</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <ClientTableHeader />
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
