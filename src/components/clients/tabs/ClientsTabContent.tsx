
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientTableContent } from '@/components/clients/table/ClientTableContent';
import { useClients } from '@/hooks/use-clients';
import { AddClientDialog } from '../AddClientDialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ClientsTabContent() {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { clients, isLoading, error, refetch } = useClients();
  const [activeTab, setActiveTab] = useState("all");
  
  // State for filtered clients
  const [filteredClients, setFilteredClients] = useState(clients || []);
  
  // Update filtered clients whenever clients or activeTab changes
  useEffect(() => {
    if (!clients) return;
    
    if (activeTab === "all") {
      setFilteredClients(clients);
    } else if (activeTab === "active") {
      setFilteredClients(clients.filter(client => client.status === "active"));
    } else if (activeTab === "inactive") {
      setFilteredClients(clients.filter(client => client.status === "inactive"));
    }
  }, [clients, activeTab]);
  
  const handleAddClient = () => {
    setIsAddClientDialogOpen(true);
  };
  
  const handleClientAdded = () => {
    setIsAddClientDialogOpen(false);
    toast.success("Client added successfully");
    refetch();
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading clients</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1"
        >
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">
              Active
              <Badge className="ml-2" variant="secondary">
                {clients?.filter(c => c.status === "active").length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TabsContent value={activeTab} forceMount className="mt-0">
            <ClientTableContent clients={filteredClients} />
          </TabsContent>
        )}
      </ScrollArea>
      
      <AddClientDialog 
        isOpen={isAddClientDialogOpen} 
        onClose={() => setIsAddClientDialogOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
