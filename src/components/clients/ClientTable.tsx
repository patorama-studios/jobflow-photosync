
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/use-clients";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientTableHeader } from "@/components/clients/table/ClientTableHeader";
import { ClientTableContent } from "@/components/clients/table/ClientTableContent";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/csv-export";

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

  const handleAddClient = async (client: Omit<typeof clients[0], 'id' | 'created_at'>) => {
    try {
      const newClient = await addClient(client);
      
      // Show a success message
      toast.success("Client added successfully");
      
      // Navigate to the new client page after a brief delay
      if (newClient && newClient.id) {
        // Short delay to allow the toast to be seen and state to update
        setTimeout(() => {
          navigate(`/customers/${newClient.id}`);
        }, 200);
      }
      
      return true; // Return success to the dialog
    } catch (error: any) {
      console.error("Error adding client:", error);
      // Error toast is already shown in the addClient function
      return false; // Return failure to the dialog
    }
  };

  const handleExport = () => {
    if (filteredClients.length === 0) {
      toast.info("No clients to export");
      return;
    }
    
    // Filter the data to export
    const exportData = filteredClients.map(client => ({
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
    
    // Use the exportToCSV function
    exportToCSV(exportData, 'clients-export');
    toast.success(`Exported ${exportData.length} clients`);
  };

  const handleImport = () => {
    // We'll implement a simple file input for CSV import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          // For now, just show a toast with the file name and size
          toast.success(`Import started: ${file.name} (${Math.round(file.size / 1024)} KB)`);
          toast.info("CSV import functionality would process the data here");
          
          console.log("CSV data to process:", csvData.substring(0, 100) + "...");
        } catch (error: any) {
          toast.error(`Import failed: ${error.message || 'Unknown error'}`);
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read the file");
      };
      
      reader.readAsText(file);
    };
    
    input.click();
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
          onExport={handleExport}
          onImport={handleImport}
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
