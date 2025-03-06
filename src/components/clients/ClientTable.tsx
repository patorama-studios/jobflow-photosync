
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MessageSquare,
  Building,
  Download,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClients, Client } from "@/hooks/use-clients";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { exportToCSV } from "@/utils/csv-export";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function ClientTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);
  
  const { clients, isLoading, error, addClient } = useClients();
  
  const filteredClients = clients.filter(
    client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    if (clients.length === 0) {
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
    
    exportToCSV(exportData, 'clients-export');
    toast.success(`Exported ${exportData.length} clients`);
  };

  const handleAddClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
    try {
      await addClient(client);
      setAddClientOpen(false);
    } catch (error) {
      console.error("Error adding client:", error);
      // Note: Error toast is already shown in the addClient function
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
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setAddClientOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead className="text-center">Jobs</TableHead>
                <TableHead className="text-center">Outstanding</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    {clients.length === 0 ? 
                      "No clients yet. Add your first client to get started." : 
                      "No clients found matching your search criteria."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={client.photo_url} alt={client.name} />
                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link to={`/client/${client.id}`} className="font-medium hover:underline">
                          {client.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {client.company && client.company_id ? (
                          <Link 
                            to={`/company/${client.company_id}`}
                            className="text-sm font-medium text-primary flex items-center hover:underline"
                          >
                            <Building className="h-3 w-3 mr-1" />
                            {client.company}
                          </Link>
                        ) : client.company ? (
                          <span className="text-sm flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {client.company}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{client.phone}</p>
                        <p className="text-muted-foreground">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <p className="font-medium">{client.total_jobs}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.outstanding_jobs} open
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-amber-600">${client.outstanding_payment}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{new Date(client.created_at).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/client/${client.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AddClientDialog 
          open={addClientOpen} 
          onOpenChange={setAddClientOpen} 
          onClientAdded={handleAddClient} 
        />
      </CardContent>
    </Card>
  );
}
