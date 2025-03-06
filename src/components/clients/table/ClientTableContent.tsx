
import React from 'react';
import { Link } from "react-router-dom";
import { Building, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "@/hooks/use-clients";
import { ClientTableRow } from "./ClientTableRow";
import { ClientTableSkeleton } from "./ClientTableSkeleton";

interface ClientTableContentProps {
  clients: Client[];
  isLoading: boolean;
  totalClients: number;
}

export function ClientTableContent({ 
  clients, 
  isLoading, 
  totalClients 
}: ClientTableContentProps) {
  return (
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
            <ClientTableSkeleton rows={5} />
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                {totalClients === 0 ? 
                  "No clients yet. Add your first client to get started." : 
                  "No clients found matching your search criteria."}
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <ClientTableRow key={client.id} client={client} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
