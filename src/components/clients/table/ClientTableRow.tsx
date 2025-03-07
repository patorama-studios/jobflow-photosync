
import React from 'react';
import { Link } from "react-router-dom";
import { Building, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client } from "@/hooks/use-clients";

interface ClientTableRowProps {
  client: Client;
}

export function ClientTableRow({ client }: ClientTableRowProps) {
  return (
    <TableRow key={client.id}>
      <TableCell>
        <Avatar>
          <AvatarImage src={client.photo_url} alt={client.name} />
          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div>
          <Link to={`/clients/${client.id}`} className="font-medium hover:underline">
            {client.name}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div>
          {client.company && client.company_id ? (
            <Link 
              to={`/companies/${client.company_id}`}
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
            <Link to={`/clients/${client.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
