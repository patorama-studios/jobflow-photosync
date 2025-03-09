
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/use-order-details';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export function useOrderDetailsView() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { setTitle, setShowBackButton, setBackButtonAction } = useHeaderSettings();
  
  const { 
    order, 
    editedOrder, 
    isLoading, 
    error, 
    isEditing, 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  } = useOrderDetails(orderId);

  useEffect(() => {
    // Set header title and back button
    if (order) {
      setTitle(`Order ${order.orderNumber || order.order_number || orderId}`);
    } else {
      setTitle('Order Details');
    }
    
    setShowBackButton(true);
    setBackButtonAction(() => navigate('/orders'));
    
    // Clean up when component unmounts
    return () => {
      setTitle(null);
      setShowBackButton(false);
    };
  }, [order, orderId, setTitle, setShowBackButton, setBackButtonAction, navigate]);

  return {
    orderId,
    order,
    editedOrder,
    isLoading,
    error,
    isEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete,
    navigate
  };
}
