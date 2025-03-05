import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, ShoppingCart, CalendarDays, Settings, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSampleOrders } from '@/hooks/useSampleOrders';

interface SearchResult {
  id: string;
  title: string;
  category: 'orders' | 'customers' | 'calendar' | 'settings' | 'company';
  url: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  onClose?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { orders } = useSampleOrders();
  const [results, setResults] = useState<SearchResult[]>([]);

  // Sample search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return [];
    }

    const searchTerm = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search orders
    orders.forEach(order => {
      if (
        order.address.toLowerCase().includes(searchTerm) ||
        order.client.toLowerCase().includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      ) {
        searchResults.push({
          id: `order-${order.id}`,
          title: `Order #${order.id} - ${order.client}`,
          category: 'orders',
          url: `/orders/${order.id}`,
          icon: <ShoppingCart className="w-4 h-4" />,
        });
      }
    });

    // Add some mock data for other categories
    if ('customer'.includes(searchTerm) || 'client'.includes(searchTerm)) {
      searchResults.push({
        id: 'customers',
        title: 'Customer Management',
        category: 'customers',
        url: '/customers',
        icon: <User className="w-4 h-4" />,
      });
    }

    if ('calendar'.includes(searchTerm) || 'schedule'.includes(searchTerm)) {
      searchResults.push({
        id: 'calendar',
        title: 'Calendar & Scheduling',
        category: 'calendar',
        url: '/calendar',
        icon: <CalendarDays className="w-4 h-4" />,
      });
    }

    if ('settings'.includes(searchTerm) || 'config'.includes(searchTerm)) {
      searchResults.push({
        id: 'settings',
        title: 'Application Settings',
        category: 'settings',
        url: '/settings',
        icon: <Settings className="w-4 h-4" />,
      });
    }

    if ('company'.includes(searchTerm) || 'organization'.includes(searchTerm)) {
      searchResults.push({
        id: 'company',
        title: 'Company Profile',
        category: 'company',
        url: '/settings/organization',
        icon: <Building className="w-4 h-4" />,
      });
    }

    return searchResults;
  };

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    if (onClose) onClose();
    navigate(result.url);
  };

  // Update search results when query changes
  useEffect(() => {
    const results = performSearch(query);
    setResults(results);
  }, [query]);

  // Open command dialog when clicking on search input
  const handleInputClick = () => {
    setOpen(true);
  };

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="relative w-full flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-1 top-0 bottom-0 h-full" 
          tabIndex={-1}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Input
          placeholder="Search anything... (Press '/' or Ctrl+K)"
          className="pl-9 pr-4 w-full"
          onClick={handleInputClick}
        />
        
        {onClose && (
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-0 bottom-0 h-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search anything..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-2"
                >
                  {result.icon}
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
