
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
      />
      
      <div className="mt-4 grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="client@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="client_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <AddClientDialog 
        isOpen={isAddClientDialogOpen}
        onClose={() => setIsAddClientDialogOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </ToggleSection>
  );
};
