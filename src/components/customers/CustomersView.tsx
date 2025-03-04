
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  UserPlus, 
  Calendar, 
  DollarSign,
  MessageSquare 
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
import { mockCustomers } from "@/components/customers/mock-data";

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCustomers = mockCustomers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your customers and teams
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead className="text-center">Jobs</TableHead>
                  <TableHead className="text-center">Outstanding</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={customer.photoUrl} alt={customer.name} />
                        <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{customer.phone}</p>
                        <p className="text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <p className="font-medium">{customer.totalJobs}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.outstandingJobs} open
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-amber-600">${customer.outstandingPayment}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{customer.createdDate}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/customers/${customer.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Interview
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
