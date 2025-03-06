
import React, { memo, useMemo, useState } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isSameDay, parseISO } from 'date-fns';
import { MapPin, Timer } from 'lucide-react';
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

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

interface DraggableAppointmentProps {
  job: Order;
  startHour: number;
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

const DraggableAppointment = memo(({ 
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

const TimeSlot = memo(({ 
  hour, 
  onTimeSlotClick,
  onDrop
}: { 
  hour: number, 
  onTimeSlotClick?: (time: string) => void,
  onDrop: (hour: number) => void 
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
    onDrop(hour);
  };

  return (
    <div 
      className="flex border-t border-gray-200 relative hover:bg-accent/30 cursor-pointer transition-colors"
      style={{ height: '60px' }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-hour={hour}
    >
      <div className="w-16 text-xs text-gray-500 -mt-2.5">{hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}</div>
      <div className="flex-1"></div>
    </div>
  );
});

TimeSlot.displayName = 'TimeSlot';

export const DayView = memo(({ date, orders, onTimeSlotClick }: DayViewProps) => {
  const { toast } = useToast();
  const [draggedJob, setDraggedJob] = useState<Order | null>(null);
  const [newHour, setNewHour] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [orders, date]);

  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  const handleDragStart = (e: React.DragEvent, job: Order) => {
    setDraggedJob(job);
    e.dataTransfer.setData('text/plain', job.id.toString());
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.classList.add('drag-image');
    dragImage.textContent = `${job.client} - ${job.scheduledTime}`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDrop = (hour: number) => {
    if (!draggedJob) return;
    
    setNewHour(hour);
    setConfirmDialogOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!draggedJob || newHour === null) return;
    
    // Format new time
    const formattedHour = newHour % 12 || 12;
    const ampm = newHour >= 12 ? 'PM' : 'AM';
    const newTime = `${formattedHour}:00 ${ampm}`;
    
    // In a real app, this would call an API to update the job
    // For now, we'll just show a toast notification
    toast({
      title: "Appointment rescheduled",
      description: `${draggedJob.client}'s appointment has been moved to ${format(date, 'MMM d')} at ${newTime}`,
    });
    
    // Close dialog
    setConfirmDialogOpen(false);
    setDraggedJob(null);
    setNewHour(null);
  };

  const handleCancelReschedule = () => {
    setConfirmDialogOpen(false);
    setDraggedJob(null);
    setNewHour(null);
  };
  
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
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {draggedJob && newHour !== null && (
                <>
                  Move {draggedJob.client}'s appointment to {format(date, 'EEEE, MMMM d')} at {' '}
                  {newHour % 12 || 12}:00 {newHour >= 12 ? 'PM' : 'AM'}?
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

DayView.displayName = 'DayView';
