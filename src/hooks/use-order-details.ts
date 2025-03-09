
import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order-types';
import { fetchOrderDetails, saveOrderChanges, deleteOrder } from '@/services/order-service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UseOrderDetailsResult {
  order: Order | null | undefined;
  isLoading: boolean;
  error: string | null;
  editedOrder: Order | null;
  isEditing: boolean;
  isDeleteDialogOpen: boolean;
  refundsForOrder: any[];
  setRefundsForOrder: (refunds: any[]) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleEditClick: () => void;
  handleCancelClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: string) => void;
  handleSaveClick: () => void;
  handleDeleteClick: () => void;
  confirmDelete: () => Promise<void>;
}

export function useOrderDetails(orderId?: string | number): UseOrderDetailsResult {
  const [order, setOrder] = useState<Order | null | undefined>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadOrderDetails = async () => {
      if (!orderId) {
        if (isMounted) {
          setIsLoading(false);
          setError("No order ID provided");
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log("Loading order details for ID:", orderId);
      try {
        const { order: fetchedOrder, error: fetchError } = await fetchOrderDetails(orderId);
        
        if (!isMounted) return;
        
        if (fetchError) {
          console.error("Error loading order:", fetchError);
          setError(fetchError);
          setOrder(null);
          toast.error(`Error loading order: ${fetchError}`);
        } else if (!fetchedOrder) {
          console.error("Order not found:", orderId);
          setError("Order not found");
          setOrder(null);
          toast.error("Order not found");
        } else {
          console.log("Order details loaded successfully:", fetchedOrder);
          setOrder(fetchedOrder);
          setEditedOrder(fetchedOrder);
          toast.success("Order details loaded");
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Exception in loadOrderDetails:", err);
          setError(err.message || "An unexpected error occurred");
          setOrder(null);
          toast.error(err.message || "An unexpected error occurred");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // Edit operations
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
    
    // Validate that status is a valid OrderStatus
    const validStatuses: OrderStatus[] = [
      "scheduled", "completed", "pending", "canceled", "cancelled",
      "rescheduled", "in_progress", "editing", "review", "delivered", "unavailable"
    ];
    
    const validStatus: OrderStatus = validStatuses.includes(status as OrderStatus) 
      ? (status as OrderStatus) 
      : "pending";
    
    setEditedOrder({
      ...editedOrder,
      status: validStatus,
    });
  };

  const handleSaveClick = async () => {
    if (!editedOrder) return;
    
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Delete operations
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
    order, 
    isLoading, 
    error,
    editedOrder,
    isEditing,
    isDeleteDialogOpen,
    refundsForOrder,
    setRefundsForOrder,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  };
}
