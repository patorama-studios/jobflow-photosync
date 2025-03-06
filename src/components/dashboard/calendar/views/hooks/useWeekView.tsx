
import { useState, useMemo } from 'react';
import { Order } from '@/types/order-types';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export function useWeekView() {
  const { toast } = useToast();
  
  // State for dragging
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);
  const [newScheduleData, setNewScheduleData] = useState<{
    order: Order | null;
    newDate: Date | null;
    newHour: number | null;
  }>({
    order: null,
    newDate: null,
    newHour: null
  });
  
  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order);
    // Set data for transfer
    e.dataTransfer.setData('text/plain', order.id.toString());
    // Set drag image
    const dragImage = document.createElement('div');
    dragImage.classList.add('drag-image');
    dragImage.textContent = `${order.client} - ${order.scheduledTime}`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drop
  const handleDrop = (date: Date, hour: number) => {
    if (!draggedOrder) return;
    
    // Set new schedule data for confirmation
    setNewScheduleData({
      order: draggedOrder,
      newDate: date,
      newHour: hour
    });
    
    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  // Handle reschedule confirmation
  const handleConfirmReschedule = () => {
    const { order, newDate, newHour } = newScheduleData;
    
    if (!order || !newDate || newHour === null) {
      return;
    }
    
    // Format new time
    const formattedHour = newHour % 12 || 12;
    const ampm = newHour >= 12 ? 'PM' : 'AM';
    const newTime = `${formattedHour}:00 ${ampm}`;
    
    // In a real app, this would call an API to update the order
    // For now, we'll just show a toast notification
    toast({
      title: "Appointment rescheduled",
      description: `${order.client}'s appointment has been moved to ${format(newDate, 'MMM d')} at ${newTime}`,
    });
    
    // Close dialog
    setConfirmDialogOpen(false);
    setDraggedOrder(null);
  };

  const handleCancelReschedule = () => {
    setConfirmDialogOpen(false);
    setDraggedOrder(null);
  };

  return {
    draggedOrder,
    newScheduleData,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDragStart,
    handleDrop,
    handleConfirmReschedule,
    handleCancelReschedule
  };
}

export function useWeekAppointments(orders: Order[], dates: Date[]) {
  // Calculate appointments for the week view
  return useMemo(() => {
    const appointmentsMap = new Map<string, { order: Order, position: { top: number, left: number, width: number } }>();
    
    orders.forEach(order => {
      if (!order.scheduledDate) return;
      
      const orderDate = new Date(order.scheduledDate);
      
      // Find which column (day) this order belongs to
      const columnIndex = dates.findIndex(date => isSameDay(date, orderDate));
      if (columnIndex === -1) return;
      
      // Parse the time to determine vertical position
      const timeStr = order.scheduledTime || '';
      const hourMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm|AM|PM)/i);
      
      if (!hourMatch) return;
      
      let orderHour = parseInt(hourMatch[1], 10);
      const isPM = /pm/i.test(hourMatch[3]);
      
      if (isPM && orderHour !== 12) orderHour += 12;
      if (!isPM && orderHour === 12) orderHour = 0;
      
      // Only show appointments that are within our display hours (8am-8pm)
      if (orderHour < 8 || orderHour > 20) return;
      
      // Calculate top position (relative to start hour of 8am)
      const topPosition = (orderHour - 8) * 16;
      
      // Width should be close to 100% for each day column
      const width = 95;
      // Left position is based on the day column
      const left = 2.5;
      
      const key = `${order.id}`;
      appointmentsMap.set(key, {
        order,
        position: {
          top: topPosition,
          left,
          width
        }
      });
    });
    
    return Array.from(appointmentsMap.values());
  }, [orders, dates]);
}

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
