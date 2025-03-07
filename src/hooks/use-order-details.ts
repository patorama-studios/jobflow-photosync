
import { useState, useEffect } from 'react';
import { Order } from '@/types/order-types';
import { fetchOrderDetails, saveOrderChanges, deleteOrder } from '@/services/order-service';
import { useNavigate } from 'react-router-dom';

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
  confirmDelete: () => void;
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
    const loadOrderDetails = async () => {
      setIsLoading(true);
      setError(null);

      console.log("Loading order details for ID:", orderId);
      const { order: fetchedOrder, error: fetchError } = await fetchOrderDetails(orderId);
      
      if (fetchError) {
        setError(fetchError);
        setOrder(null);
      } else {
        setOrder(fetchedOrder);
        setEditedOrder(fetchedOrder);
      }
      
      setIsLoading(false);
    };

    loadOrderDetails();
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
    
    setEditedOrder({
      ...editedOrder,
      status,
    });
  };

  const handleSaveClick = async () => {
    if (!editedOrder) return;
    
    try {
      const { success, error: saveError } = await saveOrderChanges(editedOrder);
      
      if (saveError) {
        setError(saveError);
      } else if (success) {
        setOrder(editedOrder);
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Error saving order:', err);
      setError(err.message || 'An unexpected error occurred while saving');
    }
  };

  // Delete operations
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { success, error: deleteError } = await deleteOrder(orderId);
      
      if (deleteError) {
        setError(deleteError);
      } else if (success) {
        // Redirect to orders page after successful deletion
        navigate('/orders');
      }
      
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setError(err.message || 'An unexpected error occurred while deleting');
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
