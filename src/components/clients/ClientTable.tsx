
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/use-clients";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientTableHeader } from "@/components/clients/table/ClientTableHeader";
import { ClientTableContent } from "@/components/clients/table/ClientTableContent";
import { toast } from "sonner";

export function ClientTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const navigate = useNavigate();
  
  const { clients, isLoading, error, addClient } = useClients();
  
  const filteredClients = clients.filter(
    client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
    try {
      const newClient = await addClient(client);
      
      // Show a success message
      toast.success("Client added successfully");
      
      // Navigate to the new client page after a brief delay
      if (newClient && newClient.id) {
        // Short delay to allow the toast to be seen and state to update
        setTimeout(() => {
          navigate(`/client/${newClient.id}`);
        }, 200);
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding client:", error);
      // Error toast is already shown in the addClient function
      return Promise.reject(error);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Client Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            Error loading clients: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Client Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientTableHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onAddClient={() => setAddClientOpen(true)}
          onExport={() => exportClients(filteredClients)}
        />
        
        <ClientTableContent 
          clients={filteredClients} 
          isLoading={isLoading} 
          totalClients={clients.length}
        />

        <AddClientDialog 
          open={addClientOpen} 
          onOpenChange={setAddClientOpen} 
          onClientAdded={handleAddClient} 
        />
      </CardContent>
    </Card>
  );
}

const exportClients = (clients) => {
  if (clients.length === 0) {
    toast.info("No clients to export");
    return;
  }
  
  // Filter the data to export
  const exportData = clients.map(client => ({
    ID: client.id,
    Name: client.name,
    Email: client.email,
    Phone: client.phone || '',
    Company: client.company || '',
    'Created Date': new Date(client.created_at).toLocaleDateString(),
    Status: client.status,
    'Total Jobs': client.total_jobs,
    'Outstanding Jobs': client.outstanding_jobs,
    'Outstanding Payment': client.outstanding_payment
  }));
  
  // Import and use the exportToCSV function
  import('@/utils/csv-export').then(module => {
    module.exportToCSV(exportData, 'clients-export');
    toast.success(`Exported ${exportData.length} clients`);
  });
};
