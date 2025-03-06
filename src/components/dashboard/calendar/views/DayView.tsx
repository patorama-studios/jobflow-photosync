
import React, { memo, useMemo } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isSameDay } from 'date-fns';
import { DraggableAppointment } from './components/DraggableAppointment';
import { TimeSlot } from './components/TimeSlot';
import { RescheduleConfirmDialog } from './components/RescheduleConfirmDialog';
import { useDayViewState } from './hooks/useDayViewState';

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export const DayView = memo(({ date, orders, onTimeSlotClick }: DayViewProps) => {
  const {
    draggedJob,
    newHour,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDragStart,
    handleDrop,
    handleConfirmReschedule,
    handleCancelReschedule
  } = useDayViewState(date);

  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [orders, date]);

  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  return (
    <div className="day-view border rounded-md p-4 overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <h3 className="text-lg font-medium mb-4">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      
      <div className="relative">
        {hours.map(hour => (
          <TimeSlot 
            key={hour} 
            hour={hour} 
            onTimeSlotClick={onTimeSlotClick} 
            onDrop={handleDrop}
          />
        ))}
        
        {jobsForDay.map(job => (
          <DraggableAppointment 
            key={job.id} 
            job={job} 
            startHour={startHour}
            onDragStart={handleDragStart} 
          />
        ))}
      </div>
      
      {jobsForDay.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No appointments scheduled for this day
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <RescheduleConfirmDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmReschedule}
        onCancel={handleCancelReschedule}
        draggedJob={draggedJob}
        newHour={newHour}
        date={date}
      />
    </div>
  );
});

DayView.displayName = 'DayView';
