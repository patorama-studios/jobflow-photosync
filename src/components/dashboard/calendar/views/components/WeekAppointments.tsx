
import React, { memo } from 'react';
import { Order } from '@/types/order-types';
import { WeekDraggableAppointment } from './WeekDraggableAppointment';
import { isSameDay } from 'date-fns';

interface WeekAppointmentsProps {
  weekAppointments: Array<{ order: Order, position: { top: number, left: number, width: number } }>;
  dates: Date[];
  onDragStart: (e: React.DragEvent, order: Order) => void;
  onAppointmentClick?: (order: Order) => void;
}

export const WeekAppointments = memo(({ 
  weekAppointments,
  dates,
  onDragStart,
  onAppointmentClick
}: WeekAppointmentsProps) => {
  // Memoize the appointments rendering to prevent unnecessary recalculations
  const appointmentsToRender = React.useMemo(() => {
    return weekAppointments.map(({ order, position }, index) => {
      // Find the column (day) this order belongs to
      const orderDate = new Date(order.scheduledDate);
      const columnIndex = dates.findIndex(date => isSameDay(date, orderDate));
      if (columnIndex === -1) return null;
      
      // Calculate the absolute position
      const columnWidth = 100 / 8; // 8 columns (1 for time, 7 for days)
      const leftPos = columnWidth * (columnIndex + 1) + (columnWidth * 0.025); // +1 because first column is time
      const widthPos = columnWidth * 0.95;
      
      return (
        <WeekDraggableAppointment
          key={`${order.id}-${index}`}
          order={order}
          position={{
            top: position.top,
            left: leftPos,
            width: widthPos
          }}
          onDragStart={onDragStart}
          onClick={onAppointmentClick}
        />
      );
    }).filter(Boolean); // Filter out null items
  }, [weekAppointments, dates, onDragStart, onAppointmentClick]);
  
  return (
    <div className="relative">
      {appointmentsToRender}
    </div>
  );
});

WeekAppointments.displayName = 'WeekAppointments';
