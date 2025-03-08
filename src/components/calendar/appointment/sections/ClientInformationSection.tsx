
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';
import { ClientSearch } from '../components/ClientSearch';
import { AddClientDialog } from '../components/AddClientDialog';
import { Client } from '@/hooks/use-clients';

interface ClientInformationSectionProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const ClientInformationSection: React.FC<ClientInformationSectionProps> = ({
  form,
  isOpen,
  onToggle
}) => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  const handleClientSelect = (client: Client) => {
    form.setValue('client', client.name);
    form.setValue('client_email', client.email);
    form.setValue('client_phone', client.phone || '');
    form.setValue('client_id', client.id);
  };

  const handleClientCreated = (client: Client) => {
    handleClientSelect(client);
  };

  return (
    <ToggleSection 
      title="Client Information" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <ClientSearch 
        onClientSelect={handleClientSelect}
        onAddNewClick={() => setIsAddClientDialogOpen(true)}
        selectedClient={form.watch('client')}
      />
      
      <AddClientDialog 
        isOpen={isAddClientDialogOpen}
        onClose={() => setIsAddClientDialogOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </ToggleSection>
  );
};
