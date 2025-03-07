
import { useState } from "react";
import { ClientTable } from "./ClientTable";
import { AddClientDialog } from "./AddClientDialog";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/use-clients";
import { PlusCircle } from "lucide-react";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { useEffect } from "react";
import { toast } from "sonner";

export function ClientsView() {
  const [addClientOpen, setAddClientOpen] = useState(false);
  const { clients, isLoading, error, refetch, addClient } = useClients();
  const { updateSettings } = useHeaderSettings();

  useEffect(() => {
    updateSettings({
      title: "Customers",
      description: "Manage your customers and clients",
    });
  }, [updateSettings]);

  const handleAddClient = async (newClient) => {
    try {
      await addClient(newClient);
      toast.success("Client added successfully");
      return true; // Return success to the dialog
    } catch (error) {
      console.error("Error adding client:", error);
      return false; // Return failure to the dialog
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customers and client relationships
          </p>
        </div>
        <Button onClick={() => setAddClientOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <ClientTable clients={clients} isLoading={isLoading} />

      <AddClientDialog
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        onClientAdded={handleAddClient}
      />
    </div>
  );
}
