
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TableCell, TableRow } from '@/components/ui/table';
import { ProductionStatus } from './types';
import { Button } from '@/components/ui/button';
import { Edit, Trash, GripVertical } from 'lucide-react';

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

export const DraggableStatusRow: React.FC<DraggableStatusRowProps> = ({
  status,
  index,
  onEditClick,
  onDeleteClick,
  onMoveRow
}) => {
  const ref = useRef<HTMLTableRowElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'status-row',
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
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
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
    type: 'status-row',
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
      style={{ opacity, cursor: 'move' }}
      data-handler-id={handlerId}
      className="hover:bg-muted/50"
    >
      <TableCell className="w-10">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </TableCell>
      <TableCell>
        <div className="font-medium">{status.name}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div
            className="h-5 w-5 rounded border"
            style={{ backgroundColor: status.color }}
          />
          <span>{status.color}</span>
        </div>
      </TableCell>
      <TableCell>{status.description || '-'}</TableCell>
      <TableCell>{status.is_default ? 'Yes' : 'No'}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(status)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(status.id)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
