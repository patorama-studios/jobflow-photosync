
import { useState } from 'react';
import { Order } from '@/types/order-types';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export function useDayViewState(date: Date) {
  const { toast } = useToast();
  const [draggedJob, setDraggedJob] = useState<Order | null>(null);
  const [newHour, setNewHour] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

  return {
    draggedJob,
    newHour,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDragStart,
    handleDrop,
    handleConfirmReschedule,
    handleCancelReschedule
  };
}
