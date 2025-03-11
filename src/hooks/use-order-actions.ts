
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { saveOrderChanges } from '@/services/orders/order-modify-service';

interface UseOrderActionsProps {
  orderId: string;
  deleteOrder: () => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export function useOrderActions({
  orderId,
  deleteOrder,
  setIsEditing,
  setIsDeleteDialogOpen
}: UseOrderActionsProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteOrder();
      toast.success("Order deleted successfully");
      navigate('/orders');
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleSaveClick = async (formData?: any) => {
    try {
      setIsSaving(true);
      
      if (formData) {
        const result = await saveOrderChanges({
          ...formData,
          id: orderId
        });
        
        if (result.success) {
          toast.success("Order updated successfully");
        } else {
          toast.error(`Failed to update order: ${result.error}`);
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/orders');
  };

  return {
    isSaving,
    handleDeleteClick,
    handleConfirmDelete,
    handleSaveClick,
    handleBackClick
  };
}
