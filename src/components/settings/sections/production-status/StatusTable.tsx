
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ProductionStatus } from './types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableStatusRow } from './DraggableStatusRow';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface StatusTableProps {
  statuses: ProductionStatus[];
  loading: boolean;
  onEditClick: (status: ProductionStatus) => void;
  onDeleteClick: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onSaveOrder: () => void;
}

export function StatusTable({
  statuses,
  loading,
  onEditClick,
  onDeleteClick,
  onReorder,
  onSaveOrder
}: StatusTableProps) {
  if (loading) {
    return <div className="py-4 text-center text-muted-foreground">Loading statuses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Drag and drop to reorder production statuses.
        </p>
        <Button variant="outline" size="sm" onClick={onSaveOrder} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Order
        </Button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No statuses found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              statuses.map((status, index) => (
                <DraggableStatusRow
                  key={status.id}
                  status={status}
                  index={index}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onMoveRow={onReorder}
                />
              ))
            )}
          </TableBody>
        </Table>
      </DndProvider>
    </div>
  );
}
