
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Client, useClients } from '@/hooks/use-clients';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { searchClients } = useClients();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        try {
          const results = await searchClients(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching clients:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchClients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectClient = (client: Client) => {
    onClientSelect(client);
    setSearchQuery(client.name);
    setShowResults(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {showResults && searchQuery.length > 2 && (
            <div className="absolute z-10 w-full mt-1 border rounded-md bg-background shadow-lg">
              {isLoading ? (
                <div className="p-2 text-center text-sm">Searching...</div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((client) => (
                    <li
                      key={client.id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.email}</div>
                    </li>
                  ))}
                </ul>
              ) : searchQuery.length > 2 ? (
                <div className="p-2 text-center text-sm">No clients found</div>
              ) : null}
            </div>
          )}
        </div>
        <Button type="button" variant="outline" onClick={onAddNewClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  );
};
