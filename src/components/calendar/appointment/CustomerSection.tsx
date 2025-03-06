
import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '@/hooks/use-clients';

interface CustomerSectionProps {
  searchCustomer: string;
  setSearchCustomer: React.Dispatch<React.SetStateAction<string>>;
  selectedCustomer: any | null;
  filteredClients: Client[];
  handleCustomerSelect: (client: any) => void;
  openNewCustomerDialog: () => void;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  searchCustomer,
  setSearchCustomer,
  selectedCustomer,
  filteredClients,
  handleCustomerSelect,
  openNewCustomerDialog
}) => {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Customer</p>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for a customer..." 
          className="pl-9"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
      </div>
      
      {searchCustomer && filteredClients.length > 0 && (
        <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className="p-2 hover:bg-muted/50 cursor-pointer"
              onClick={() => handleCustomerSelect(client)}
            >
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          ))}
        </div>
      )}
      
      {selectedCustomer && (
        <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
          <p className="font-medium">{selectedCustomer.name}</p>
          <p className="text-muted-foreground">{selectedCustomer.email}</p>
          {selectedCustomer.company && (
            <p className="text-muted-foreground">{selectedCustomer.company}</p>
          )}
        </div>
      )}
      
      <Button 
        variant="link" 
        className="p-0 h-auto text-primary mt-1"
        onClick={openNewCustomerDialog}
      >
        Create New Customer
      </Button>
    </div>
  );
};
