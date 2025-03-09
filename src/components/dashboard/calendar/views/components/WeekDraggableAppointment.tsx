
import React, { memo } from 'react';
import { Order } from '@/types/order-types';

interface WeekDraggableAppointmentProps {
  order: Order;
  position: {
    top: number;
    left: number;
    width: number;
  };
  onDragStart: (e: React.DragEvent, order: Order) => void;
  onClick?: (order: Order) => void;
}

export const WeekDraggableAppointment = memo(({
  order,
  position,
  onDragStart,
  onClick
}: WeekDraggableAppointmentProps) => {
  const statusColor = getStatusColor(order.status);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    if (onClick) {
      onClick(order);
    }
  };
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      onClick={handleClick}
      className="absolute rounded border cursor-pointer transition-shadow hover:shadow-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}%`,
        width: `${position.width}%`,
        height: '15px',
        backgroundColor: statusColor,
        zIndex: 10,
      }}
      data-order-id={order.id} // Add data attribute for debugging
    >
      <div className="truncate text-xs px-1 text-white">
        {order.client || order.customerName} - {order.scheduledTime}
      </div>
    </div>
  );
});

// Helper function to get color based on status
function getStatusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#10b981'; // green
    case 'cancelled':
      return '#ef4444'; // red
    case 'scheduled':
      return '#3b82f6'; // blue
    case 'pending':
      return '#f59e0b'; // amber
    default:
      return '#6b7280'; // gray
  }
}

WeekDraggableAppointment.displayName = 'WeekDraggableAppointment';
