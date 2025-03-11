
import React from "react";
import { Client } from "@/hooks/use-clients";
import { Search } from "lucide-react";

interface ClientsTabProps {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  handleClientClick: (clientId: string) => void;
}

export function ClientsTab({
  clients,
  isLoading,
  error,
  searchQuery,
  handleClientClick
}: ClientsTabProps) {
  // Filter customers based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-3">Client</th>
            <th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Company</th>
            <th className="text-right px-4 py-3">Total Jobs</th>
            <th className="text-right px-4 py-3">Outstanding</th>
            <th className="text-right px-4 py-3">Amount Due</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8">Loading clients...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-red-500">Error loading clients</td>
            </tr>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <tr 
                key={client.id} 
                className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => handleClientClick(client.id)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                      {client.photo_url && (
                        <img 
                          src={client.photo_url} 
                          alt={client.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div>{client.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{client.company || '-'}</td>
                <td className="px-4 py-3 text-right">{client.total_jobs || 0}</td>
                <td className="px-4 py-3 text-right">{client.outstanding_jobs || 0}</td>
                <td className="px-4 py-3 text-right">${(client.outstanding_payment || 0).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">No clients found. Try adjusting your search.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
