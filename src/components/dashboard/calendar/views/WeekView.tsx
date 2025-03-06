
import React, { memo } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { WeekGrid } from './components/WeekGrid';
import { WeekAppointments } from './components/WeekAppointments';
import { WeekRescheduleDialog } from './components/WeekRescheduleDialog';
import { useWeekView, useWeekAppointments } from './hooks/useWeekView';

interface WeekViewProps {
  dates: Date[];
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export const WeekView = memo(({ dates, orders, onTimeSlotClick }: WeekViewProps) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
  
  // Use custom hooks for logic
  const {
    draggedOrder,
    newScheduleData,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDragStart,
    handleDrop,
    handleConfirmReschedule,
    handleCancelReschedule
  } = useWeekView();
  
  // Get calculated appointments
  const weekAppointments = useWeekAppointments(orders, dates);

  return (
    <div className="week-view overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <WeekGrid 
        dates={dates}
        hours={hours}
        onTimeSlotClick={onTimeSlotClick}
        onDrop={handleDrop}
      />

      <WeekAppointments 
        weekAppointments={weekAppointments}
        dates={dates}
        onDragStart={handleDragStart}
      />
      
      <WeekRescheduleDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmReschedule}
        onCancel={handleCancelReschedule}
        orderData={newScheduleData}
      />
    </div>
  );
});

WeekView.displayName = 'WeekView';
