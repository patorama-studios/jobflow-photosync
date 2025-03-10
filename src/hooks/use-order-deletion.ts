
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteOrder } from '@/services/orders/order-delete-service';

export function useOrderDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) {
      toast.error('Invalid order ID');
      return false;
    }
    
    setIsDeleting(true);
    
    try {
      const result = await deleteOrder(orderId);
      
      if (result.success) {
        toast.success('Order deleted successfully');
        return true;
      } else {
        toast.error(`Failed to delete order: ${result.error}`);
        return false;
      }
    } catch (error: any) {
      toast.error(`Error deleting order: ${error.message}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteOrderAndRedirect = async (orderId: string) => {
    const success = await handleDeleteOrder(orderId);
    
    if (success) {
      navigate('/orders');
    }
    
    return success;
  };

  return {
    isDeleting,
    handleDeleteOrder,
    deleteOrderAndRedirect
  };
}
