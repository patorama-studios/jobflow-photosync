
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteOrder } from '@/services/order-service';
import { toast } from 'sonner';

interface UseOrderDeletionProps {
  orderId?: string | number;
  setError: (error: string | null) => void;
}

interface UseOrderDeletionResult {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteClick: () => void;
  confirmDelete: () => Promise<void>;
}

export function useOrderDeletion({
  orderId,
  setError
}: UseOrderDeletionProps): UseOrderDeletionResult {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    try {
      const { success, error: deleteError } = await deleteOrder(orderId);
      
      if (deleteError) {
        setError(deleteError);
        toast.error(`Failed to delete: ${deleteError}`);
        setIsDeleteDialogOpen(false);
        return;
      } 
      
      if (success) {
        toast.success("Order deleted successfully");
        // Redirect to orders page after successful deletion
        navigate('/orders', { replace: true });
        setIsDeleteDialogOpen(false);
      }
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setError(err.message || 'An unexpected error occurred while deleting');
      toast.error(err.message || 'An unexpected error occurred while deleting');
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteClick,
    confirmDelete
  };
}
