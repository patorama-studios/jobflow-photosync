
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client } from '@/hooks/use-clients';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/company-utils';
import { useNavigate } from 'react-router-dom';

interface ClientTableProps {
  clients: Client[];
  isLoading?: boolean;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export const ClientTable: React.FC<ClientTableProps> = ({ clients, isLoading = false }) => {
  const navigate = useNavigate();

  // Function to handle row click
  const handleRowClick = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(client.id)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={client.photo_url || undefined} alt={client.name} />
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{client.name}</div>
                    {client.company && (
                      <div className="text-xs text-muted-foreground">
                        {client.company}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone || 'N/A'}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    client.status === 'active'
                      ? statusColors.active
                      : statusColors.inactive
                  }
                >
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{client.total_jobs || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
