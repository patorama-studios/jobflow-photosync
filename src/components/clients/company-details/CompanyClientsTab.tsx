
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface CompanyClientsTabProps {
  companyClients: any[];
  clientsLoading: boolean;
  company: any;
}

export function CompanyClientsTab({ companyClients, clientsLoading, company }: CompanyClientsTabProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Clients</CardTitle>
        <CardDescription>
          Clients associated with {company.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : companyClients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyClients.map((client) => (
                <TableRow 
                  key={client.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/customer/${client.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        {client.photo_url ? (
                          <img src={client.photo_url} alt={client.name} />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <span>{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.total_jobs || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No clients found for this company
          </div>
        )}
        
        <div className="mt-4">
          <Button onClick={() => navigate('/customers', { state: { activeTab: 'customers' } })}>
            <Users className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
