
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Client } from '@/hooks/use-clients';
import { Button } from '@/components/ui/button';
import { Edit, Trash, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface ClientTableProps {
  clients: Client[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
  onRowClick?: (client: Client) => void;
  updateClient?: (id: string, updates: Partial<Client>) => Promise<void>;
}

export function ClientTable({ 
  clients, 
  isLoading = false, 
  error = null, 
  onEdit, 
  onDelete,
  onRowClick,
  updateClient 
}: ClientTableProps) {
  const { toast } = useToast();

  const handleEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(client);
    } else if (updateClient) {
      // Fallback to updateClient if onEdit is not provided
      updateClient(client.id, client);
    }
  };

  const handleDelete = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(clientId);
      toast({
        title: "Client deleted",
        description: "The client has been removed"
      });
    }
  };

  const handleRowClick = (client: Client) => {
    if (onRowClick) {
      onRowClick(client);
    }
  };

  // Render error message
  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(client)}
            >
              <TableCell className="font-medium">{client.id.substring(0, 8)}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                <Badge 
                  variant={client.status === 'active' ? 'outline' : 'secondary'}
                  className={client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e: any) => handleEdit(client, e)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e: any) => handleDelete(client.id, e)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No clients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
