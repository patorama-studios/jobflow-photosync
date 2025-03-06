
import React, { memo, useMemo, useState } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isSameDay, addHours, setHours, parseISO } from 'date-fns';
import { Timer, MapPin } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

interface WeekViewProps {
  dates: Date[];
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

interface DraggableAppointmentProps {
  order: Order;
  position: { top: number, left: number, width: number };
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

const DraggableAppointment = memo(({ 
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

DraggableAppointment.displayName = 'DraggableAppointment';

const WeekTimeSlot = memo(({ 
  date,
  hour,
  colIndex,
  onTimeSlotClick,
  onDrop
}: { 
  date: Date;
  hour: number;
  colIndex: number;
  onTimeSlotClick?: (time: string) => void;
  onDrop: (date: Date, hour: number) => void;
}) => {
  const handleClick = () => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(date, hour);
  };

  return (
    <div 
      className="p-1 border-t border-gray-200 h-16 hover:bg-accent/30 cursor-pointer transition-colors relative"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-hour={hour}
      data-col={colIndex}
    />
  );
});

WeekTimeSlot.displayName = 'WeekTimeSlot';

export const WeekView = memo(({ dates, orders, onTimeSlotClick }: WeekViewProps) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8am to 8pm
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

  // Calculate appointments for the week view
  const weekAppointments = useMemo(() => {
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

  return (
    <div className="week-view overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <div className="grid grid-cols-8 gap-1">
        <div className="h-14 flex items-end pb-2">
          <span className="text-xs text-muted-foreground">Time</span>
        </div>
        
        {dates.map(date => (
          <div key={date.toISOString()} className="h-14 flex flex-col items-center justify-end pb-2">
            <div className="text-sm font-medium">{format(date, 'EEE')}</div>
            <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
          </div>
        ))}
        
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-xs text-muted-foreground h-16 flex items-center">
              {hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}
            </div>
            
            {dates.map((date, colIndex) => (
              <WeekTimeSlot 
                key={`${date.toISOString()}-${hour}`}
                date={date}
                hour={hour}
                colIndex={colIndex}
                onTimeSlotClick={onTimeSlotClick}
                onDrop={handleDrop}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Render appointments */}
      <div className="relative">
        {weekAppointments.map(({ order, position }, index) => {
          // Find the column (day) this order belongs to
          const orderDate = new Date(order.scheduledDate);
          const columnIndex = dates.findIndex(date => isSameDay(date, orderDate));
          if (columnIndex === -1) return null;
          
          // Calculate the absolute position
          const columnWidth = 100 / 8; // 8 columns (1 for time, 7 for days)
          const leftPos = columnWidth * (columnIndex + 1) + (columnWidth * 0.025); // +1 because first column is time
          const widthPos = columnWidth * 0.95;
          
          return (
            <DraggableAppointment
              key={`${order.id}-${index}`}
              order={order}
              position={{
                top: position.top,
                left: leftPos,
                width: widthPos
              }}
              onDragStart={handleDragStart}
            />
          );
        })}
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {newScheduleData.order && newScheduleData.newDate && (
                <>
                  Move {newScheduleData.order.client}'s appointment to {format(newScheduleData.newDate, 'EEEE, MMMM d')} at {' '}
                  {newScheduleData.newHour ? `${newScheduleData.newHour % 12 || 12}:00 ${newScheduleData.newHour >= 12 ? 'PM' : 'AM'}` : ''}?
                  <p className="mt-2">
                    A notification will be sent to the client about this change.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelReschedule}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReschedule}>Confirm Reschedule</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

WeekView.displayName = 'WeekView';
