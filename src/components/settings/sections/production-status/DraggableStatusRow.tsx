
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, GripVertical } from 'lucide-react';
import { ProductionStatus } from './types';

interface DraggableStatusRowProps {
  status: ProductionStatus;
  index: number;
  onEditClick: (status: ProductionStatus) => void;
  onDeleteClick: (id: string) => void;
  onMoveRow: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function DraggableStatusRow({
  status,
  index,
  onEditClick,
  onDeleteClick,
  onMoveRow
}: DraggableStatusRowProps) {
  const ref = useRef<HTMLTableRowElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'row',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      // Dragging downwards and only move when cursor has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards and only move when cursor has crossed half of the items height
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      onMoveRow(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  
  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: () => {
      return { id: status.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));
  
  return (
    <TableRow 
      ref={ref} 
      style={{ opacity }} 
      data-handler-id={handlerId}
      className="hover:bg-secondary/20"
    >
      <TableCell className="w-10 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell>{status.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: status.color }}
          />
          <span>{status.color}</span>
        </div>
      </TableCell>
      <TableCell>{status.description}</TableCell>
      <TableCell>{status.is_default ? "Yes" : "No"}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditClick(status)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDeleteClick(status.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
