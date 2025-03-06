
import React, { memo } from 'react';
import { Order } from '@/types/order-types';
import { MapPin, Timer } from 'lucide-react';

interface DraggableAppointmentProps {
  order: Order;
  position: { top: number, left: number, width: number };
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

export const WeekDraggableAppointment = memo(({ 
  order, 
  position,
  onDragStart
}: DraggableAppointmentProps) => {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      className="absolute bg-primary/10 border-l-4 border-primary rounded-r-md px-2 py-1 cursor-move hover:bg-primary/20 transition-colors"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}%`, 
        width: `${position.width}%`,
        height: '60px',
        zIndex: 10,
      }}
    >
      <div className="text-xs font-medium truncate">{order.scheduledTime} - {order.client}</div>
      <div className="text-xs flex items-center mt-1 truncate">
        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
        <span className="truncate">{order.address}</span>
      </div>
      {order.drivingTimeMin && (
        <div className="text-xs flex items-center mt-1">
          <Timer className="h-3 w-3 mr-1 flex-shrink-0" />
          {Math.floor(order.drivingTimeMin / 60)}h {order.drivingTimeMin % 60}m
        </div>
      )}
    </div>
  );
});

WeekDraggableAppointment.displayName = 'WeekDraggableAppointment';
