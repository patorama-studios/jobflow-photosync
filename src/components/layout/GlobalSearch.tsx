import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { FileText, Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/use-orders';
import { useCompanies } from '@/hooks/use-companies';
import { useClients } from '@/hooks/use-clients';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    {
      id: string;
      title: string;
      description: string;
      icon: React.ElementType;
      url: string;
    }[]
  >([]);
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { companies } = useCompanies();
  const { clients } = useClients();

  useEffect(() => {
    // Only search if there's a query
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    // Filter orders
    const filteredOrders = orders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(lowerCaseQuery) ||
        order.client.toLowerCase().includes(lowerCaseQuery) ||
        order.address.toLowerCase().includes(lowerCaseQuery) ||
        order.photographer?.toLowerCase().includes(lowerCaseQuery)
    );

    const orderResults = filteredOrders.map((order) => ({
      id: `order-${order.id}`,
      title: `Order #${order.order_number}`,
      description: `${order.client} - ${order.address}`,
      icon: FileText,
      url: `/orders/${order.id}`,
    }));

    // Filter companies
    const filteredCompanies = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(lowerCaseQuery) ||
        company.email.toLowerCase().includes(lowerCaseQuery) ||
        company.phone.toLowerCase().includes(lowerCaseQuery)
    );

    const companyResults = filteredCompanies.map((company) => ({
      id: `company-${company.id}`,
      title: company.name,
      description: `${company.email} - ${company.phone}`,
      icon: Building,
      url: `/company/${company.id}`,
    }));

    // Filter clients
    const filteredClients = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerCaseQuery) ||
        client.email.toLowerCase().includes(lowerCaseQuery) ||
        client.phone.toLowerCase().includes(lowerCaseQuery)
    );

    const clientResults = filteredClients.map((client) => ({
      id: `client-${client.id}`,
      title: client.name,
      description: `${client.email} - ${client.phone}`,
      icon: Users,
      url: `/client/${client.id}`,
    }));

    // Combine results
    const combinedResults = [...orderResults, ...companyResults, ...clientResults];

    setSearchResults(combinedResults);
  }, [query, orders, companies, clients, navigate]);

  const onSelectValue = (url: string) => {
    setOpen(false);
    setQuery("");
    navigate(url);
  };

  return (
    <>
      <button
        className="group flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setOpen(true)}
      >
        Search
        <span className="ml-auto w-5 h-5 flex items-center justify-center rounded-md bg-secondary text-secondary-foreground group-hover:bg-muted group-hover:text-muted-foreground">
          ⌘K
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.length > 0 && (
            <>
              <CommandGroup heading="Results">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => onSelectValue(result.url)}
                  >
                    {result.icon && <result.icon className="mr-2 h-4 w-4" />}
                    <span>{result.title}</span>
                    <span className="ml-auto text-muted-foreground text-sm">
                      {result.description}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
