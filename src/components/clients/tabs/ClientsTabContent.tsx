
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-clients';
import { ClientTable } from '../ClientTable';
import { AddClientDialog } from '@/components/calendar/appointment/components/AddClientDialog';
import { ClientTableHeader } from '../table/ClientTableHeader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ClientsTabContentProps {
  companyId?: string;
}

export const ClientsTabContent: React.FC<ClientsTabContentProps> = ({ companyId }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { 
    clients, 
    isLoading, 
    error, 
    refreshClients,
    addClient 
  } = useClients(companyId);
  
  useEffect(() => {
    refreshClients();
  }, [refreshClients]);
  
  const handleAddClient = () => {
    setIsAddClientOpen(true);
  };
  
  const handleClientAdded = async () => {
    await refreshClients();
    return true;
  };
  
  const handleClientClick = (clientId: string) => {
    navigate(`/customers/client/${clientId}`);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };
  
  const handleExport = () => {
    toast.info("Export functionality not implemented yet");
  };
  
  if (error) {
    return <div>Error loading clients: {error.message}</div>;
  }
  
  return (
    <div className="space-y-4">
      <ClientTableHeader 
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onAddClient={handleAddClient}
        onExport={handleExport}
      />
      
      <ClientTable 
        clients={clients} 
        isLoading={isLoading} 
        error={error as Error}
        onClientClick={handleClientClick} 
      />
      
      {isAddClientOpen && (
        <AddClientDialog 
          open={isAddClientOpen} 
          onClose={() => setIsAddClientOpen(false)} 
          onClientCreated={() => {
            handleClientAdded();
            setIsAddClientOpen(false);
          }}
        />
      )}
    </div>
  );
};
