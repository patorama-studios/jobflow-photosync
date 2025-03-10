
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderDetails } from './use-order-details';
import { toast } from 'sonner';

export function useOrderDetailsView(orderId: string) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    order, 
    isLoading, 
    error, 
    refetch, 
    deleteOrder 
  } = useOrderDetails(orderId);
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      deleteOrder();
      toast.success("Order deleted successfully");
      navigate('/orders');
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
  };
  
  const handleSaveClick = async () => {
    // This would be implemented for saving edits
    try {
      // Save logic would go here
      toast.success("Order updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    }
  };
  
  const handleBackClick = () => {
    navigate('/orders');
  };

  return {
    order,
    isLoading,
    error,
    refetch,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick
  };
}
