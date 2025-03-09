
import { useState } from 'react';
import { Order } from '@/types/order-types';
import { useNavigate } from 'react-router-dom';
import { useOrderLoading } from './use-order-loading';
import { useOrderEditing } from './use-order-editing';
import { useOrderDeletion } from './use-order-deletion';

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
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load order data
  const { 
    order, 
    setOrder, 
    isLoading, 
    error, 
    setError 
  } = useOrderLoading({ orderId });

  // Handle order editing
  const {
    editedOrder,
    isEditing,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick
  } = useOrderEditing({
    order,
    setOrder,
    setError
  });

  // Handle order deletion
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteClick,
    confirmDelete
  } = useOrderDeletion({
    orderId,
    setError
  });

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
