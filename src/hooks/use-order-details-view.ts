
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/use-order-details';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';
import { Order } from '@/types/order-types';

export function useOrderDetailsView() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { setTitle, setShowBackButton, setBackButtonAction } = useHeaderSettings();
  
  const { 
    order, 
    isLoading, 
    error,
    deleteOrder, 
  } = useOrderDetails(orderId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  
  useEffect(() => {
    if (order && !editedOrder) {
      setEditedOrder(order);
    }
  }, [order, editedOrder]);

  useEffect(() => {
    // Set header title and back button
    if (!isLoading && order) {
      setTitle(`Order ${order.orderNumber || order.order_number || orderId}`);
    } else {
      setTitle('Order Details');
    }
    
    setShowBackButton(true);
    setBackButtonAction(() => () => navigate('/orders'));
    
    // Clean up when component unmounts
    return () => {
      setTitle(null);
      setShowBackButton(false);
      setBackButtonAction(undefined);
    };
  }, [order, orderId, isLoading, setTitle, setShowBackButton, setBackButtonAction, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (order) {
      setEditedOrder(order);
    }
  };

  const handleSaveClick = async () => {
    // In a real application, you would save the changes here
    setIsEditing(false);
    if (order) {
      setEditedOrder(order);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
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
      status: status as any,
    });
  };

  const confirmDelete = async (): Promise<void> => {
    if (orderId) {
      deleteOrder();
      navigate('/orders');
    }
    setIsDeleteDialogOpen(false);
  };

  return {
    orderId,
    order,
    editedOrder,
    isLoading,
    error,
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
    confirmDelete,
    navigate
  };
}
