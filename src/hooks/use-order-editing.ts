
import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order-types';
import { saveOrderChanges } from '@/services/order-service';
import { toast } from 'sonner';
import { validateStatus } from '@/utils/order-status-utils';

interface UseOrderEditingProps {
  order: Order | null | undefined;
  setOrder: (order: Order | null) => void;
  setError: (error: string | null) => void;
}

interface UseOrderEditingResult {
  editedOrder: Order | null;
  isEditing: boolean;
  handleEditClick: () => void;
  handleCancelClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: string) => void;
  handleSaveClick: () => Promise<void>;
}

export function useOrderEditing({ 
  order, 
  setOrder,
  setError 
}: UseOrderEditingProps): UseOrderEditingResult {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedOrder(order);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedOrder) return;
    
    const { name, value } = e.target;
    setEditedOrder({
      ...editedOrder,
      [name]: value,
    });
  };

  const handleStatusChange = (status: string) => {
    if (!editedOrder) return;
    
    const validStatus = validateStatus(status);
    
    setEditedOrder({
      ...editedOrder,
      status: validStatus,
    });
  };

  const handleSaveClick = async () => {
    if (!editedOrder) return;
    
    try {
      const { success, error: saveError } = await saveOrderChanges(editedOrder);
      
      if (saveError) {
        setError(saveError);
        toast.error(`Failed to save: ${saveError}`);
      } else if (success) {
        setOrder(editedOrder);
        setIsEditing(false);
        toast.success("Order updated successfully");
      }
    } catch (err: any) {
      console.error('Error saving order:', err);
      setError(err.message || 'An unexpected error occurred while saving');
      toast.error(err.message || 'An unexpected error occurred while saving');
    }
  };

  return {
    editedOrder,
    isEditing,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick
  };
}
