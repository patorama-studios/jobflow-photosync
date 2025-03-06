
import React, { memo } from 'react';
import { Order } from '@/types/order-types';
import { MapPin, Timer } from 'lucide-react';

interface DraggableAppointmentProps {
  job: Order;
  startHour: number;
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

export const DraggableAppointment = memo(({ 
  job, 
  startHour,
  onDragStart
}: DraggableAppointmentProps) => {
  const timeComponents = job.scheduledTime.split(':');
  const hour = parseInt(timeComponents[0], 10);
  const minute = parseInt(timeComponents[1].split(' ')[0], 10);
  const isPM = job.scheduledTime.includes('PM');
  
  const jobHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  const topPosition = ((jobHour - startHour) * 60 + minute) / 15;
  
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      className="absolute left-16 right-4 bg-primary/10 border-l-4 border-primary rounded-r-md px-2 py-1 cursor-move hover:bg-primary/20 transition-colors"
      style={{ 
        top: `${topPosition * 6}px`, 
        height: '80px',
        zIndex: 10,
      }}
    >
      <div className="text-xs font-medium">{job.scheduledTime} - {job.client}</div>
      <div className="text-xs flex items-center mt-1">
        <MapPin className="h-3 w-3 mr-1" />
        {job.address}
      </div>
      {job.drivingTimeMin && (
        <div className="text-xs flex items-center mt-1">
          <Timer className="h-3 w-3 mr-1" />
          {Math.floor(job.drivingTimeMin / 60)}h {job.drivingTimeMin % 60}m
        </div>
      )}
    </div>
  );
});

DraggableAppointment.displayName = 'DraggableAppointment';
