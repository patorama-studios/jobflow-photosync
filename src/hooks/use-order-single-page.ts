
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderDetails } from './use-order-details';
import { toast } from 'sonner';
import { Order } from '@/types/order-types';

type OrderSinglePageProps = {
  orderId: string;
};

export const useOrderSinglePage = ({ orderId }: OrderSinglePageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { 
    order, 
    isLoading, 
    error, 
    refetch 
  } = useOrderDetails(orderId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editedOrder || !order) return;
    
    const { name, value } = e.target;
    setEditedOrder({
      ...editedOrder,
      [name]: value
    });
  };

  const handleStatusChange = (status: string) => {
    if (!editedOrder || !order) return;
    
    setEditedOrder({
      ...editedOrder,
      status: status as any
    });
  };

  const handleEditClick = () => {
    if (!order) return;
    setEditedOrder(order);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedOrder(null);
  };

  const handleSaveClick = async () => {
    if (!editedOrder) return;
    
    try {
      // Save implementation would go here
      
      toast.success('Order updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update order');
      console.error(error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Delete implementation would go here
      
      toast.success('Order deleted successfully');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to delete order');
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeliverClick = async () => {
    setIsDelivering(true);
    
    try {
      // Delivery implementation would go here
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Delivery email sent successfully');
    } catch (error) {
      toast.error('Failed to send delivery email');
      console.error(error);
    } finally {
      setIsDelivering(false);
    }
  };

  const handleBackClick = () => {
    navigate('/orders');
  };

  return {
    order,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    isEditing,
    editedOrder,
    isDelivering,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleInputChange,
    handleStatusChange,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleDeliverClick,
    handleBackClick,
    refetch
  };
};
