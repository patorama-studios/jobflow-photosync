
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetails } from './use-order-details';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types/order-types';
import { validateStatus } from '@/utils/order-status-utils';

export function useOrderSinglePage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  
  // Default empty order for editing with proper OrderStatus type
  const emptyOrder: Order = {
    id: '',
    status: 'pending', // Using a valid OrderStatus instead of empty string
    orderNumber: '',
    address: '',
    propertyType: '',
    squareFeet: 0,
    client: '',
    price: 0,
    scheduledDate: '',
    scheduledTime: '',
    photographer: '',
  };
  
  const [editedOrder, setEditedOrder] = useState<Order>(emptyOrder);
  
  const { 
    order, 
    isLoading, 
    error, 
    refetch, 
    deleteOrder 
  } = useOrderDetails(orderId || '');
  
  // Update editedOrder when order data changes
  useState(() => {
    if (order) {
      setEditedOrder(order);
    }
  });
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
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
    // Reset edited order to original values
    if (order) {
      setEditedOrder(order);
    }
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (status: OrderStatus) => {
    setEditedOrder(prev => ({
      ...prev,
      status
    }));
  };

  return {
    order,
    isLoading,
    error,
    refetch,
    orderId,
    editedOrder,
    refundsForOrder,
    setRefundsForOrder,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    handleDeleteClick,
    confirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick,
    handleInputChange,
    handleStatusChange,
    navigate,
  };
}
