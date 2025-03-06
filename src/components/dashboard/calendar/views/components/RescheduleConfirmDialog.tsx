
import React from 'react';
import { format } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
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

interface RescheduleConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  draggedJob: Order | null;
  newHour: number | null;
  date: Date;
}

export const RescheduleConfirmDialog: React.FC<RescheduleConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  draggedJob,
  newHour,
  date
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Reschedule</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
