
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

interface RescheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  orderData: {
    order: Order | null;
    newDate: Date | null;
    newHour: number | null;
  };
}

export const WeekRescheduleDialog: React.FC<RescheduleDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  orderData
}) => {
  const { order, newDate, newHour } = orderData;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reschedule Appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            {order && newDate && newHour !== null && (
              <>
                Move {order.client}'s appointment to {format(newDate, 'EEEE, MMMM d')} at {' '}
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
