
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MessageSquare,
  Building
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
import { mockCustomers, mockCompanies } from "@/components/clients/mock-data";

export function ClientTable() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredClients = mockCustomers.filter(
    client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find company ID by name for linking
  const getCompanyIdByName = (companyName: string) => {
    const company = mockCompanies.find(c => c.name === companyName);
    return company ? company.id : undefined;
  };

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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
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
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={client.photoUrl} alt={client.name} />
                      <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {client.company ? (
                        <Link 
                          to={`/companies/${getCompanyIdByName(client.company)}`}
                          className="text-sm font-medium text-primary flex items-center hover:underline"
                        >
                          <Building className="h-3 w-3 mr-1" />
                          {client.company}
                        </Link>
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
                      <p className="font-medium">{client.totalJobs}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.outstandingJobs} open
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-amber-600">${client.outstandingPayment}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{client.createdDate}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/clients/${client.id}`}>View</Link>
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
  );
}
