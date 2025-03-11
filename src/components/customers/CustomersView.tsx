
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter, Building, Users } from "lucide-react";
import { mockCustomers } from "./mock-data";
import { Client, useClients } from "@/hooks/use-clients";
import { AddClientDialog } from "@/components/calendar/appointment/components/AddClientDialog";

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("clients");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { clients, isLoading, error, refetch } = useClients();
  
  // Filter customers based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    setIsAddClientDialogOpen(true);
  };

  const handleClientCreated = (client: any) => {
    refetch();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Customers</h2>
          <Button className="flex items-center" onClick={handleAddClient}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <Tabs defaultValue="clients" onValueChange={setActiveTab}>
          <div className="flex mb-4">
            <TabsList>
              <TabsTrigger value="clients" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Companies
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="mb-4">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All {activeTab === "clients" ? "Clients" : "Companies"}</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="outstanding">Outstanding Balance</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="clients" className="space-y-4">
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
                        onClick={() => window.location.href = `/customers/${client.id}`}
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
          </TabsContent>
          
          <TabsContent value="companies" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Industry</th>
                    <th className="text-right px-4 py-3">Total Jobs</th>
                    <th className="text-right px-4 py-3">Open Jobs</th>
                    <th className="text-right px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Company listing will be implemented in a future update.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="active">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Active {activeTab === "clients" ? "clients" : "companies"} view</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">New {activeTab === "clients" ? "clients" : "companies"} view</p>
            </div>
          </TabsContent>
          
          <TabsContent value="outstanding">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">{activeTab === "clients" ? "Clients" : "Companies"} with outstanding balance</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AddClientDialog 
        isOpen={isAddClientDialogOpen} 
        onClose={() => setIsAddClientDialogOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </Card>
  );
}
