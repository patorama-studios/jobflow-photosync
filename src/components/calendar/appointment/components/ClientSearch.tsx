
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/hooks/use-clients';

interface ClientSearchProps {
  onClientSelect: (client: Client) => void;
  onAddNewClick: () => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ 
  onClientSelect,
  onAddNewClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchClients = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(10);

      if (error) {
        throw error;
      }

      setSearchResults(data || []);
    } catch (error: any) {
      console.error('Error searching clients:', error);
      toast.error(`Failed to search clients: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchClients(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <FormItem>
            <FormLabel>Search Clients</FormLabel>
            <div className="relative">
              <Input
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </FormItem>
        </div>
        <Button type="button" onClick={onAddNewClick} variant="outline">
          <UserPlusIcon className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((client) => (
              <div
                key={client.id}
                className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => onClientSelect(client)}
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">
                  {client.email} {client.phone ? `• ${client.phone}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-sm text-center text-muted-foreground">Searching...</div>
      )}

      {!isSearching && searchQuery.length > 1 && searchResults.length === 0 && (
        <div className="text-sm text-center text-muted-foreground">
          No clients found. Try a different search or create a new client.
        </div>
      )}
    </div>
  );
};
