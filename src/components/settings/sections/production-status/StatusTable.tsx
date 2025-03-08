
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, GripVertical } from 'lucide-react';
import { ProductionStatus } from './types';

interface StatusTableProps {
  statuses: ProductionStatus[];
  onEditClick: (status: ProductionStatus) => void;
  onDeleteClick: (id: string) => void;
  loading: boolean;
}

export function StatusTable({ 
  statuses, 
  onEditClick, 
  onDeleteClick,
  loading 
}: StatusTableProps) {
  if (loading) {
    return (
      <div className="py-6 text-center text-muted-foreground">Loading statuses...</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Order</TableHead>
          <TableHead className="w-[150px]">Name</TableHead>
          <TableHead className="w-[100px]">Color</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Default</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statuses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No production statuses found
            </TableCell>
          </TableRow>
        ) : (
          statuses.map((status) => (
            <TableRow key={status.id}>
              <TableCell>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </TableCell>
              <TableCell>
                <Badge style={{ backgroundColor: status.color, color: "#fff" }}>
                  {status.name}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-5 w-5 rounded-full border" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span>{status.color}</span>
                </div>
              </TableCell>
              <TableCell>{status.description || '-'}</TableCell>
              <TableCell>{status.is_default ? 'Yes' : 'No'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditClick(status)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeleteClick(status.id)}
                    disabled={status.is_default}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
