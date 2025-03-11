
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Filter } from "lucide-react";
import { mockCustomers, Customer } from "./mock-data";

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Customers</h2>
          <Button className="flex items-center">
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
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="outstanding">Outstanding Balance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-right px-4 py-3">Total Jobs</th>
                    <th className="text-right px-4 py-3">Outstanding</th>
                    <th className="text-right px-4 py-3">Amount Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => window.location.href = `/customers/${customer.id}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                            {customer.photoUrl && (
                              <img 
                                src={customer.photoUrl} 
                                alt={customer.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div>{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{customer.company}</td>
                      <td className="px-4 py-3 text-right">{customer.totalJobs}</td>
                      <td className="px-4 py-3 text-right">{customer.outstandingJobs}</td>
                      <td className="px-4 py-3 text-right">${customer.outstandingPayment.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No customers found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Active customers view</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">New customers view</p>
            </div>
          </TabsContent>
          
          <TabsContent value="outstanding">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Customers with outstanding balance</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
